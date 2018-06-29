class RestClass {
    constructor(url, Method) {
        this.ClassName = "RestClass";
        this._http = new XMLHttpRequest();
        this._url = url;
        this._method = Method;
    }
    Request(data, callback) {
        this._http.open(this._method, this._url, true);
        this._http.responseType = "json";
        this._http.onreadystatechange = function () {
            if (this._http.readyState == 4 && this._http.status == 200)
                callback(this._http.response);
        }
        this._http.send(data);
    };
    RequestFile(data, callback) {
        this._http = new XMLHttpRequest();
        this._http.open(this._method, this._url, true);
        this._http.onreadystatechange = x => {
            if (this._http.readyState == 4 && this._http.status == 200)
                callback(this._http.response);
        }
        this._http.send(data);
    }
}