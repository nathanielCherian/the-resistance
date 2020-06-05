function validateForm() {
    var x = document.forms["createForm"]["name"].value;
    if (x.replace(/^\s+|\s+$/g, '') == "") {
      document.forms["createForm"]["name"].value = ""
      alert("Name must be filled out");
      return false;
    }
  }