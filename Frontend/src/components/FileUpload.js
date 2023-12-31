import { useState } from "react";
import axios from "axios";
import "./FileUpload.css";

const FileUpload = ({ contract, account, provider }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No File selected");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `22da385d42510ed154bf`,
            pinata_secret_api_key: `c3d3530a6a7071923544f78a3bd37da9adf49162f8c8e273e3076a3f8b95bc44`,
            "Content-Type": "multipart/form-data",
          },
        });
        const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
        
        const signer = contract.connect(provider.getSigner());
        signer.add(account, ImgHash);
      } catch (e) {
        alert("Unable to upload File to Pinata");
      }
    }
    alert("Successfully File Uploaded");
    setFileName("No File selected");
    setFile(null);
  };
  const retrieveFile = (e) => {
    const data = e.target.files[0]; 
    
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(e.target.files[0]);
    };
    setFileName(e.target.files[0].name);
    e.preventDefault();
  };
  return (
    <div className="top">
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="file-upload" className="choose">
          Choose File
        </label>
        <input
          type="file"
          id="file-upload"
          name="data"
          onChange={retrieveFile}
        />
        <span className="textArea">File: {fileName}</span>
        <button type="submit" className="upload" disabled={!file}>
          Upload
        </button>
      </form>
    </div>
  );
};
export default FileUpload;
