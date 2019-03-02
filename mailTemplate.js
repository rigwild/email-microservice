/**
 * Email template
 *
 * @param {string} name Sender full name
 * @param {string} email Sender email
 * @param {string} subject Email subject
 * @param {string} message Email content
 */
module.exports = (name, email, subject, message) => `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300">
  <link rel="stylesheet" href="https://cdn.rawgit.com/necolas/normalize.css/master/normalize.css">
  <link rel="stylesheet" href="https://cdn.rawgit.com/milligram/milligram/master/dist/milligram.min.css">
</head>
<style>
  .row {
    width: calc(100% + .0rem) !important;
  }
  form {
    padding: 50px 0px !important;
  }
  #message {
    height: 200px !important;
  }
  input:hover, textarea:hover {
    transition-duration: .5s;
    border-color: #8e90ee;
    outline: 0;
    cursor: text;
  }
  @media (max-width: 40.0rem) {
    form {
      max-width: 100% !important;
      width: 95% !important;
      margin: 0 10px !important;
    }
  }
  @media (max-width: 80.0rem) {
    form {
      padding: 20px 0 !important;
    }
  }
</style>
<body>
<div class="row">
  <form class="column column-50 column-offset-25">
    <h2>Email envoyé depuis le microservice.</h2>
    
    <label for="nom">Nom</label>
    <input type="text" id="nom" value="${name}" readonly>

    <label for="email">Adresse email</label>
    <input type="text" id="email" value="${email}" readonly>

    <label for="objet">Objet</label>
    <input type="text" id="objet" value="${subject}" readonly>

    <label for="message">Message</label>
    <textarea id="message" rows="60" readonly>${message}</textarea>
  </form>
</div>

</body>
</html>
`
