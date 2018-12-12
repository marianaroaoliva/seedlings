
function datamuse(params, callback) {
  var query = "";
  for (var item in params) {
    query += item + "=" + params[item] + "&"
  }
    console.log(query)

  $.get(
      "http://127.0.0.1:5000/datamuse?" + query,
      function(data) {
        console.log(data);
      }
  );
}

var test = {
  "word": "justice",
  "domain": "juice",
  "type": "plant"
}

datamuse(test);
