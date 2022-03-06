import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';

function Contact() {
  const [message, setMessage] = useState('');
  const [parent, setParent] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useParams();

  useEffect(() => {
    const getParent = async () => {
      const docRef = doc(db, 'users', params.parentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setParent(docSnap.data());
      } else {
        toast.error('Could not get parent information');
      }
    };

    getParent();
  }, [params.parentId]);

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div className="pageContainer">
      <header>
        <p className="pageTitle">Send a Message</p>
      </header>

      {parent !== null && (
        <main>
          <div className="contactLandlord">
            <p className="pageTitle">to {parent?.name}</p>
          </div>
          <form className="messageForm">
            <div className="messageDiv">
              <label htmlFor="message" className="messageLabel">
                Message
              </label>
              <textarea
                name="message"
                id="message"
                className="textarea"
                value={message}
                onChange={onChange}
              ></textarea>
            </div>
            <a
              href={`mailto:${
                parent.email
              }?Subject=We would like to practice with ${searchParams.get(
                'buddyName'
              )}!&body=${message}`}
            >
              <button type="button" className="primaryButton">
                Send Message
              </button>
            </a>
          </form>
        </main>
      )}
    </div>
  );
}

export default Contact;
