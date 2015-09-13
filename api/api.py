from flask import Flask, request
from flask_restful import Resource, Api, reqparse
import numpy as np
from sklearn.preprocessing import scale
from sklearn.cross_validation import train_test_split
from sklearn.metrics import accuracy_score
from sknn.mlp import Classifier, Layer, Convolution

app = Flask(__name__)
api = Api(app)

def nn(config):
    print config
    nLayers = []
    for x in config["layers"]:
        if x.size == 1:
            nLayers.append(Layer(x.ltype))
        else:
            nLayers.append(Layer(x.ltype, units=x.size))

    data = None

    if config["dataset"] == u'wine':
        data = np.loadtxt(fname="winequality-white.csv", delimiter = ',', skiprows=1);

        X, Y = data[:, :-1], data[:, -1]

        x_train, x_test, y_train, y_test = train_test_split(X, Y, test_size=.1, random_state=50)

        x_train = scale(x_train)
        x_test = scale(x_test) 

        x = Classifier(
            layers = nLayers,
            learning_rate = float(config["learning_rate"]),
            n_iter=int(config["num_iter"]))

        x.fit(x_train, y_train)

        score = x.score(x_test, y_test)
        print score
        return score

class nLayer:
    def __init__(self):
        self.ltype = "null"
        self.size = 0

layers = []
class Train(Resource):
    def get(self):
        return "test"
    def post(self):
        config = {}
        layers = []
        config["dataset"] = request.json["dataset"]
        config["num_iter"] = request.json["num_iter"]
        config["learning_rate"] = request.json["learning_rate"]
        for idx,val in enumerate(request.json["layers"]):
             layers.append(nLayer())
             layers[idx].ltype = val["type"]
             layers[idx].size = val["size"]
        config["layers"] = layers
        score = nn(config)
        return score

api.add_resource(Train, "/train")

if __name__ == '__main__':
    app.run(debug=True)


