from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():
	return render_template("home.html")

@app.route("/one")
def one():
	return render_template("oneplayer.html")

@app.route("/two")
def two():
	return render_template("twoplayer.html")

@app.route("/online")
def online():
	return render_template("comingsoon.html")
	

if __name__ == "__main__":
	app.run(debug=True)