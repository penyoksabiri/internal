const express = require('express');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const axios = require('axios');
const port = 3000;
const csv = require('csv-parser');
const app = express();


app.use(session({
  secret: 'belajarnodejs2tahun',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, 'public')));


function checkAuth(req, res, next) {
  if (req.session && req.session.userId) {
    
    next();
  } else {
    
    res.redirect('/index.html');
  }
}

function checkAuthpro(req, res, next) {
    if (req.session && req.session.userId) {
      next();
    } else {
      res.send(`
        <html>
          <head>
            <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
          </head>
          <body>
            <script>
              Swal.fire({
                icon: 'error',
                title: 'Gagal Memuat Aplikasi',
                text: 'Silahkan login kembali',
                footer: '<a href="index.html">Login Sekarang</a>',
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false,
                showConfirmButton: false
              }).then(() => {
                window.location.href = '/index.html';
              });
            </script>
          </body>
        </html>
      `);
    }
  }
  

  app.get('/home', checkAuthpro, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html')); 
  });

  app.get('/training', checkAuthpro,(req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'training.html'));  
});

app.get('/logins-consultation-office', checkAuthpro,(req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'logins-consultation-office.html'));  
});

app.get('/report-daily', checkAuthpro,(req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'report-daily.html'));  
});

app.get('/rd', checkAuthpro,(req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'rd.html')); 
});

app.get('/sales-tools-resources', checkAuthpro,(req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'sales-tools-resources.html')); 
});

app.get('/social-media-marketing-newsletter-management', checkAuthpro,(req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'social-media-marketing-newsletter-management.html'));  
});

app.get('/material-specifications-and-catalogues', checkAuthpro,(req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'material-specifications-and-catalogues.html')); 
});


app.get('/supplier-price-list', checkAuthpro,(req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'supplier-price-list.html'));  
});

app.get('/complain-sugestions', checkAuthpro,(req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'complain-sugestions.html'));  
});




function verifyAbsensiSession(req, res, next) {
  if (req.session && req.session.username && req.session.jabatan) {
    const { username, jabatan } = req.body;
    if (username === req.session.username && jabatan === req.session.jabatan) {
      next(); 
    } else {
      res.status(403).json({ message: 'Unauthorized: Session data mismatch' });
    }
  } else {
    res.status(403).json({ message: 'Unauthorized: No session data' });
  }
}


// function readCSV() {
//     const data = fs.readFileSync('users.csv', 'utf8');
//     return data.split('\n').filter(row => row).map(row => {
//       const [id, username, password, securityQuestion, securityAnswer, name, position] = row.split(',');
//       return { id, username, password, securityQuestion, securityAnswer, name, position };
//     });
// }
  

// function writeCSV(users) {
//     const csvContent = users.map(user => `${user.id},${user.username},${user.password},${user.securityQuestion},${user.securityAnswer},${user.name},${user.position}`).join('\n');
//     fs.writeFileSync('users.csv', csvContent, 'utf8');
// }


function readCSV() {
    if (!fs.existsSync('users.csv')) {
        console.error('CSV file not found');
        return []; // Kembalikan array kosong jika file tidak ditemukan
    }
    const data = fs.readFileSync('users.csv', 'utf8');
    return data.split('\n').filter(row => row).map(row => {
        const [id, username, password, securityQuestion, securityAnswer, name, position] = row.split(',');
        return { id, username, password, securityQuestion, securityAnswer, name, position };
    });
}


function writeCSV(users) {
    const csvContent = users.map(user => `${user.id},${user.username},${user.password},${user.securityQuestion},${user.securityAnswer},${user.name},${user.position}`).join('\n');
    try {
        fs.writeFileSync('users.csv', csvContent, 'utf8');
        console.log("CSV updated successfully");
    } catch (err) {
        console.error('Error writing to CSV:', err);
        throw new Error('Could not write to CSV file');
    }
}








app.get('/user-session', (req, res) => {
    if (req.session.username && req.session.nama && req.session.jabatan) {
        res.json({ 
            username: req.session.username, 
            nama: req.session.nama, 
            jabatan: req.session.jabatan 
        });
    } else {
        res.status(401).json({ message: 'User not logged in' });
    }
});


const csvFilePath = path.join(__dirname, 'dataabsensi.csv');


if (!fs.existsSync(csvFilePath)) {
    fs.writeFileSync(csvFilePath, 'Username,Jabatan,Waktu\n', 'utf8');
}




async function verifyPublicIP(req, res, next) {
    try {
        const response = await axios.get('https://ipapi.co/json/');
        const data = response.data;
        const currentIP = data.ip;
     

      
        
        const ALLOWED_IP = ['36.81.8.196','180.253.77.159'];
        let latitude = -6.8048;
        let longitude = 110.8374;
        if (req.body.absenType === 'kantor') {
            if (ALLOWED_IP.includes(currentIP)) {
                console.log('Absen dari kantor', currentIP);
                next();
            } else {
                const latitudeapi = data.latitude;
                const longitudeapi = data.longitude;
   
        
                if (latitude === latitudeapi, longitude === longitudeapi ) { 
                    console.log('Absen dari kantor');
                    next();
                } else {
                    console.error('IP atau lokasi tidak diizinkan. Current IP:', currentIP);
                    res.status(403).json({ message: 'Kamu Harus Menggunakan Jaringan Kantor' });
                }
            }
        } else {
            console.log('Absen dari rumah', currentIP);
            next();
        }
    } catch (error) {
        console.error('Error fetching public IP address:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}



function verifyAbsensiSession(req, res, next) {
   
    next();
}


app.post('/submit-absensi', verifyPublicIP, verifyAbsensiSession, (req, res) => {
    const { nama, jabatan, waktu, absenType } = req.body;

    if (!nama || !jabatan || !waktu) {
        return res.status(400).json({ message: 'Invalid data' });
    }

    const csvLine = `${nama},${jabatan},${waktu},${absenType}\n`;

   
    fs.appendFile(csvFilePath, csvLine, (err) => {
        if (err) {
            console.error('Error writing to CSV:', err);
            return res.status(500).json({ message: 'Harap Gunakan Jaringan Kantor' });
        }
        res.json({ message: 'Absensi berhasil dicatat' });
    });
});



app.get('/profile', (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    const users = readCSV();
    const user = users.find(user => user.id === req.session.userId);
  
    if (user) {
      res.json({
        username: user.username,
        name: user.name,
        position: user.position
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
});
  

app.post('/update-profile', (req, res) => {
    const { name, position } = req.body;

    console.log("Received data:", name, position); 

    if (!req.session.userId) {
        console.log("Unauthorized access - No session found"); 
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const users = readCSV();
    const user = users.find(user => user.id === req.session.userId);

    if (user) {
        user.name = name;
        user.position = position;

     
        writeCSV(users);

        console.log("Profile updated successfully"); 
        return res.status(200).json({ message: 'Profile updated successfully', name: user.name, position: user.position });
    } else {
        console.log("User not found in CSV"); 
        return res.status(404).json({ message: 'User not found' });
    }
});


app.post('/register', async (req, res) => {
  const { username, password, securityQuestion, securityAnswer } = req.body;

  try {
      const users = readCSV();
      const userExists = users.find(user => user.username === username);
  
      if (userExists) {
          return res.status(400).json({ message: 'Username already exists' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const hashedAnswer = await bcrypt.hash(securityAnswer, 10);
      const newUser = {
          id: uuidv4(),
          username,
          password: hashedPassword,
          securityQuestion,
          securityAnswer: hashedAnswer
      };
  
      writeCSV([newUser, ...users]);
      res.status(201).json({ message: 'User registered successfully', id: newUser.id });
  } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
        const users = readCSV();
        const user = users.find(u => u.username === username);
  
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
  
   
        const isMatch = await bcrypt.compare(password, user.password);
  
        if (isMatch) {
            req.session.userId = user.id;
            req.session.username = user.username;
            req.session.nama = user.name; 
            req.session.jabatan = user.position; 
  
            if (username === 'superuser') {
                return res.status(200).json({
                    message: 'Login successful',
                    redirect: '/admin.html'
                });
            } else {
                return res.status(200).json({
                    message: 'Login successful',
                    redirect: '/home'
                });
            }
        } else {
            return res.status(400).json({ message: 'Invalid password' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
  });
  

function checkSuperuser(req, res, next) {
    if (req.session.username === 'superuser') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden: Superuser access required' });
    }
}

app.get('/data-absensi', checkSuperuser, (req, res) => {
  fs.readFile(csvFilePath, 'utf8', (err, data) => {
      if (err) {
          console.error('Error reading absensi file:', err);
          return res.status(500).json({ message: 'Failed to read absensi data' });
      }
      res.json({ data });
  });
});


app.get('/home', (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    const users = readCSV();
    const user = users.find(user => user.id === req.session.userId);
  
    if (user) {
      res.json({
        username: user.username,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
});


app.get('/profil.html', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'profil.html'));
  });
  




  

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.redirect('/index.html');
    });
});


app.post('/forgot-password', async (req, res) => {
  const { username, securityAnswer, newPassword } = req.body;

  try {
      const users = readCSV();
      const user = users.find(user => user.username === username);

      if (!user) {
          return res.status(400).json({ message: 'User not found' });
      }

      const isAnswerMatch = await bcrypt.compare(securityAnswer, user.securityAnswer);
      if (!isAnswerMatch) {
          return res.status(400).json({ message: 'Incorrect security answer' });
      }

   
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedNewPassword;

    
      const updatedUsers = users.map(u => (u.username === username ? user : u));
      writeCSV(updatedUsers);

      res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
      console.error('Error during password update:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
