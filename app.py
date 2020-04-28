from flask import Flask, render_template, url_for, session, request, redirect
from config import Config


app = Flask(__name__)
app.config.from_object(Config)


@app.route('/', methods=['GET', 'POST'])
def home():
    if request.method == "POST":
        session['data'] = request.form['code'].strip(' ')
        return redirect(url_for('lobby'))

    return render_template('home.html')

@app.route('/lobby')
def lobby():
    data = session['data']
    return  'you entered ' + data

@app.route('/getstarted')
def getstarted():
    return render_template("getstarted.html")

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')