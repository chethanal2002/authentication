import { useState } from 'react'; 
import './App.css';
const uuid = require('uuid');

function App() {
  const [image, setImage] = useState('');
  const [uploadResultMessage, setUploadResultMessage] = useState('Please upload an image to authenticate');
  const [visitorName, setVisitorName] = useState('placeholder.jpeg');
  const [isAuth, setAuth] = useState(false);
  
  function sendImage(e) {
    e.preventDefault();
    setVisitorName(image.name);
    const visitorImageName = uuid.v4();
    fetch(`https://y8t4al1uhb.execute-api.ap-south-1.amazonaws.com/ver/visitor-storage/${visitorImageName}.png`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'image/png' 
      },
      body: image
    }).then(async () => {
      const response = await authenticate(visitorImageName);
      if (response.Message === 'Success'){
        setAuth(true);
        setUploadResultMessage(`Hi ${response['firstName']} ${response['lastName']}!`) 
      } else {
        setAuth(false); 
        setUploadResultMessage(`Authentication Failed: this person is not a student of NITW.`)
      }
    }).catch(error => {
      setAuth(false);
      setUploadResultMessage(`There is an error during authentication process. Please try again.`)
      console.error(error);
    })
  }

  async function authenticate(visitorImageName){
    const requestUrl = `https://y8t4al1uhb.execute-api.ap-south-1.amazonaws.com/ver/student?` + new URLSearchParams({
      objectKey: `${visitorImageName}.png`
    });
    return await fetch(requestUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' 
      }
    }).then(response => response.json())
    .then((data) => {
      return data;
    }).catch(error => console.error(error));
  }

  return (
    <div className="App"> 
      <h2>Facial Recognition System</h2> 
      <form onSubmit={sendImage}>
        <input type='file' name='image' onChange={e => setImage(e.target.files[0])}/> 
        <button type='submit'>Authenticate</button>
      </form>
      <div  className={isAuth ? 'success' : 'failure' }>{uploadResultMessage}</div>
      <img src={ require(`./visitors/${visitorName}`) } alt="Visitor" height={250} width={250}/>
    </div>
  );
}

export default App;
