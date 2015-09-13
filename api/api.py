current_nn = -1
from flask import Flask, request, send_from_directory
from flask_restful import Resource, Api, reqparse
import numpy as np
from sklearn.preprocessing import scale
from sklearn.cross_validation import train_test_split
from sklearn.metrics import accuracy_score
from sklearn import datasets
from sknn.mlp import Classifier, Layer, Convolution
from sknn.ae import AutoEncoder, Layer as ae
import pickle
import time
import sys
import logging

from flask.ext.cors import CORS

app = Flask(__name__)
CORS(app)

api = Api(app)


logging.basicConfig(
            format="%(message)s",
            level=logging.DEBUG,
            stream=sys.stdout)


def nn(config):
    print config
    nLayers = []
    for x in config["layers"]:
        if x.size == 1:
            nLayers.append(Layer(x.ltype))
        elif x.ltype == "Maxout":
            nLayers.append(Layer(x.ltype, units=x.size, pieces=x.pieces))
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
        current_nn = x
        print score
        return score, ""
    if config["dataset"] == u"heart":
        data = np.loadtxt(fname="heart_disease.csv", delimiter=',',
                skiprows=1)
        X, Y = data[:, :-1], data[:, -1]
        x_train, x_test, y_train, y_test = train_test_split(X, Y, test_size=0.2, random_state=50)
        x_train = scale(x_train)
        x_test = scale(x_test)

        y = Classifier(
            layers = nLayers,
            learning_rate = float(config["learning_rate"]),
            n_iter=int(config["num_iter"])
        )

        y.fit(x_train, y_train)
        score = y.score(x_test, y_test)
        current_nn = y
        print score
        return score, ""
    if config["dataset"] == "handwrite":
        print "Downloading data..."
        data = datasets.fetch_mldata("MNIST original")

        x_train, x_test, y_train, y_test = train_test_split(data.data/255.0, data.target.astype("int0"), test_size = .2)
        x_train = scale(x_train)
        x_test = scale(x_test)

        x = Classifier(
            layers = nLayers,
            learning_rate = float(config["learning_rate"]),
            n_iter=int(config["num_iter"]))

        x.fit(x_train, y_train)
        score = x.score(x_test, y_test)
        return score, x


class nLayer:
    def __init__(self):
        self.ltype = "null"
        self.size = 0
        self.pieces = -1


layers = []
class Train(Resource):
    def get(self):
        global current_nn
        samples = pickle.load(open ("samples.pkl", 'rb'))
        return current_nn.predict(samples[0][0])
    def post(self):
        print request.json
        global current_nn
        
        config = {}
        layers = []
        config["dataset"] = request.json["dataset"]
        config["num_iter"] = request.json["num_iter"]
        config["learning_rate"] = request.json["learning_rate"]
        for idx,val in enumerate(request.json["layers"]):
             layers.append(nLayer())
             layers[idx].ltype = val["type"]
             layers[idx].size = val["size"]
             if layers[idx].ltype == "Maxout":
                 layers[idx].pieces = val["pieces"]
        config["layers"] = layers
        score,current_nn = nn(config)
        print current_nn
        return score
class Test(Resource):
    def post(self):
        global current_nn
        test_data = request.json["data"]
        samples = pickle.load(open ("samples.pkl", 'rb'))
        t = samples[0][0]
        t = t.reshape(1, 784) 

        dat = np.zeros((1, 784));
        i=0
        for x in test_data:
            dat[0][i] = x;
            i+=1;
        print dat
        print t

        score = current_nn.predict(t)
        print score
        return score[0][0]
        
api.add_resource(Train, "/train")
api.add_resource(Test, "/test")

@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  return response


if __name__ == '__main__':
    app.run(debug=True)
