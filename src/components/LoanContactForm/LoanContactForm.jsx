import React, { useState, useRef, useEffect, useContext } from 'react';
import styles from './LoanContactForm.module.scss';
import { Row, Col } from 'react-bootstrap';
import InputField from '../InputField/InputField';
import FileUploadButton from '../FileUploadButton/FileUploadButton';
import { FaCloudUploadAlt } from 'react-icons/fa';
import Button from '../Button/Button';
import { validateInput } from '../../utils/validateInput';
import axios from 'axios';
import { nigeriaStates } from '../../utils/nigeriaStates';
import { ToastContainer, toast } from 'react-toastify';
import { Context as LoanContext } from '../../context/LoanContext';
import { Context as AuthContext } from '../../context/AuthContext';
import BeatLoader from 'react-spinners/BeatLoader';



const LoanContactForm = ({ submitContact }) => {

  // const { state: { user } } = useContext(AuthContext);
  const { state: { loading } } = useContext(LoanContext);

  const [contactAddress, setContactAddress] = useState({
    streetAddress: "",
    city: "",
    state: "",
    lga: "",
    residentialStatus: ""
  });

  const [contactErrors, setContactErrors] = useState({
    streetAddress: null,
    city: null,
    state: null,
    lga: null,
    residentialStatus: null
  })

  const [lgaOptions, setLgaOptions] = useState([]);
  const [lgaLoading, setLgaLoading] = useState(false);

  useEffect(() => {
    if(contactAddress.state.length > 0) {
      const getLga = async() => {
        setLgaLoading(true);
        const response = await axios.get(`https://locationsng-api.herokuapp.com/api/v1/states/${contactAddress.state}/lgas`)
        setLgaOptions(response.data);
        setLgaLoading(false);
      };
  
      getLga();
    }
  }, [contactAddress.state])


  const proofofAddressRef = useRef(null);

  const updateContactInfo = () => {
    if(proofofAddressRef.current.files.length > 0) {
      console.log(proofofAddressRef);
      const proofofAddress = proofofAddressRef.current.files[0];
      console.log(proofofAddress);
      const validated = validateInput(contactAddress, setContactErrors)
      console.log(validated);
      if(validated) {
        const data = new FormData();
        data.append("city", contactAddress.city);
        data.append("street", contactAddress.streetAddress);
        data.append("state", contactAddress.state);
        data.append("local_government", contactAddress.lga);
        data.append("residential_status", contactAddress.residentialStatus);
        data.append("image", proofofAddress);
        submitContact(data);
        // addAddressForLoan(data, user.user_id);
      }
    } else {
      toast.error("You need to upload a proof of address document to proceed");
    }
  }

  return (
    <div className={styles.contactForm}>
      <ToastContainer position="top-center" />
      <Row className="mb-4">
        <Col>
          <InputField 
            label="Address"
            nameAttr="address"
            type="text"
            value={contactAddress.streetAddress}
            changed={(val) => {
              setContactErrors({ ...contactErrors, streetAddress: null })
              setContactAddress({ ...contactAddress, streetAddress: val })
            }}
            error={contactErrors.streetAddress && contactErrors.streetAddress}
          />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <InputField 
            type="text"
            nameAttr="city"
            label="City"
            value={contactAddress.city}
            changed={(val) => {
              setContactErrors({ ...contactErrors, city: null })
              setContactAddress({ ...contactAddress, city: val })
            }}
            error={contactErrors.city && contactErrors.city}
          />
        </Col>
        <Col>
          <InputField 
            type="select"
            nameAttr="state"
            label="State"
            options={nigeriaStates}
            value={contactAddress.state}
            changed={(val) => {
              setContactErrors({ ...contactErrors, state: null })
              setContactAddress({ ...contactAddress, state: val })
            }}
            error={contactErrors.state && contactErrors.state}
          />
        </Col>
        <Col>
          { !lgaLoading ? <InputField 
            type="select"
            nameAttr="localGovt"
            label="Local Govt. Area"
            options={lgaOptions}
            value={contactAddress.lga}
            changed={(val) => {
              setContactErrors({ ...contactErrors, lga: null })
              setContactAddress({ ...contactAddress, lga: val })
            }}
            error={contactErrors.lga && contactErrors.lga}
          /> :
            <div className={styles.loaderWrapper}>
              <BeatLoader color="#741763" size={10} />
            </div>
          }
        </Col>
      </Row>
      <Row>
        <Col>
          <InputField 
            type="select"
            label="Residential Status"
            nameAttr="residentialStatus"
            options={['Renting', 'Owned']}
            value={contactAddress.residentialStatus}
            changed={(val) => {
              setContactErrors({ ...contactErrors, residentialStatus: null })
              setContactAddress({ ...contactAddress, residentialStatus: val })
            }}
            error={contactErrors.residentialStatus && contactErrors.residentialStatus}
          />
        </Col>
        <Col>
          <FileUploadButton 
            label="Choose File" 
            icon={<FaCloudUploadAlt className="ml-3" size="1.2em" />}
            id="address-upload" 
            fileRef={proofofAddressRef}
            visibleLabel="Proof of Address"
            fullwidth
          />
          <p className={styles.inputHint}>Note: Proof of address could be your recent utility bill or any other valid document containing your residential address.</p>
        </Col>
      </Row>
      <Button 
        className="mt-4" 
        fullWidth 
        clicked={updateContactInfo} 
        bgColor="#741763" 
        size="lg" 
        color="#EBEBEB"
        disabled={loading}
        loading={loading}
      >
        Continue
      </Button>
    </div>
  )
}


export default LoanContactForm;