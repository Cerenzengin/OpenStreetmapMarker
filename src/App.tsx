import React, { useEffect, useState } from "react";
import MapComponent from "./MapComponent";
import axios from 'axios';

function App() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  // rendering previews
  useEffect(() => {
    if (!files) return;

    let tmp: string[] = [];

    for (let i = 0; i < files.length; i++) {
      tmp.push(URL.createObjectURL(files[i]));
    }

    setPreviews(tmp);

    // free memory
    return () => {
      tmp.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const handleFileUpload = async () => {
    if (!files) {
      console.error('Please select a file');
      return;
    }

    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append('photo', files[i]);
    }

    try {
      const response = await axios.post('http://localhost:3001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data.message);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  return (
    <div style={appContainer}>
      <div
        style={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "red",
          alignContent: "center",
          display: "flex",
        }}
      >
        Issue Map
      </div>
      <div
        style={{
          flex: 1,
          flexDirection: "row",
          display: "flex",
        }}
      >
        <div style={todoColumn}>
          <MapComponent />
          <main className="container">
            <br />
            <h3>Form with image preview</h3>
            <input
              type="file"
              accept="image/jpg, image/jpeg, image/png"
              multiple
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setFiles(e.target.files);
                }
              }}
            />
            <div style={photoContainer}>
              {previews &&
                previews.map((pic, index) => {
                  return (
                    <img
                      key={index}
                      src={pic}
                      alt={`Preview ${index}`}
                      style={{ width: '200px', height: 'auto', marginBottom: '10px' }}
                    />
                  );
                })}
            </div>
            <button onClick={handleFileUpload}>Upload Files</button>
          </main>
        </div>
      </div>
    </div>
  );
}

const todoColumn: React.CSSProperties = {
  flex: 1,
  flexDirection: "column",
  backgroundColor: "white",
  padding: 10,
  margin: 10,
  borderRadius: 10,
};

const photoContainer: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column', // Ensure images stack vertically
  alignItems: 'center', // Center images horizontally
  marginTop: 10,
};

const appContainer: React.CSSProperties = {
  flex: 1,
  flexDirection: "column",
  backgroundColor: "black",
  height: "100vh",
  width: "100vw",
  display: "flex",
};

export default App;