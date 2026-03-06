const loginBtn = document.getElementById('loginBtn').addEventListener('click', function () {
   const userName = document.getElementById('userName').value.trim()


   const password = document.getElementById('password').value.trim()

   if (userName === "") {
      alert('Please enter username');
   }
   else if (password === "") {
      alert('Please enter password');
   }
   else if (userName !== 'admin') {
      alert('Wrong username');
   }
   else if (password !== 'admin123') {
      alert('Wrong password');
   }
   else {
      window.location.href = "index.html";
   }

})