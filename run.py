from the_resistance.app import app, socketio, db

if __name__ == '__main__':
    db.create_all()
    socketio.run(app, debug=True, host='0.0.0.0')