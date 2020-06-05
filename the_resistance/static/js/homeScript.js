function validateForm() {
    var n = document.forms["box"]["uname"].value;
    var c = document.forms["box"]["code"].value;

    if (n.replace(/^\s+|\s+$/g, '') == "") {
      document.forms["box"]["uname"].value = ""
      alert("Name must be filled out");
      return false;
    }


  }