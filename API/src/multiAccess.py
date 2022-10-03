from app import app
import requests



for i in range(10):
    app.run(debug=True, port=5001+i)

for i in range(10):
    port=5001+i
    resp = requests.get("http://127.0.0.1:{}/powerMonthReport/2022-05-01/2022-06-01".format(port))
    