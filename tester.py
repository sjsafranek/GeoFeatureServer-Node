import requests

resp = requests.post("http://localhost:3000/api/v1/push", json={
    "datasource_id": "TEST",
    "feature": {
        "type":"Feature",
        "properties": {
            "name": "stefan"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [12, 50]
        }
    }
})

print(resp.text)
