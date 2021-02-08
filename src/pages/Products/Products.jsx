import React, { useState } from 'react';
import styles from './Products.module.scss';
import NavBar from '../../components/NavBar/NavBar';
import Credit from '../../assets/icons/credit.svg';
import Notes from '../../assets/icons/gypsyNotes.svg';
import Advisory from '../../assets/icons/advisory.svg';
import Alternative from '../../assets/icons/alternative.svg';
import { Row, Col } from 'react-bootstrap';
import Button from '../../components/Button/Button';
import { FaAngleDown } from 'react-icons/fa';
import Funding from '../../assets/icons/funding.svg';
import Calendar from '../../assets/icons/calendar.svg';
import Accept from '../../assets/icons/accept.svg';
import Time from '../../assets/icons/races.svg';
import { BiCheckSquare } from 'react-icons/bi';
import { RiSendPlaneFill } from 'react-icons/ri';
import Footer from '../../components/Footer/Footer';
import Customer from '../../assets/excited-customer.jpeg';
import Investor from '../../assets/excited-investor.jpg';
import { useRouteMatch, Link } from 'react-router-dom';


const ProductBanner = ({ productTitle, btnType, copy, btnText }) => {
  return (
    <div className={styles.ctaBanner}>
      <div className={styles.container}>
        <div className={styles.bannerBox}>
          <div>
            <h2>{productTitle}</h2>
            <p>{copy}</p>
            { btnType === "textButton" &&
              <button className={styles.textBtn}>Be the first to know when we launch</button>
            }
            { btnType === "normal" &&
              <Button
                bgColor="#fff"
                color="#741763"
                size="lg"
                className={["mt-4", styles.customBtn].join(' ')}
              >
                {btnText}
              </Button>
            }
          </div>
          <div className={styles.circleOutlineOne}></div>
          <div className={styles.circleOutlineTwo}></div>
          <div className={styles.firstCircle}></div>
          <div className={styles.secondCircle}></div>
          <div className={styles.thirdCircle}></div>
          <div className={styles.fourthCircle}></div>
          <div className={styles.fifthCircle}></div>
          <div className={styles.sixthCircle}></div>
          <div className={styles.downIcon}>
            <FaAngleDown size="3em" />
          </div>
        </div>
      </div>
    </div>
  )
}


const HowItWorks = ({ 
  children, 
  mainTitle, 
  minorTitle, 
  steps, 
  imageCopy, 
  btnText, 
  productName,
  btnType
}) => {
  return (
    <div className={styles.howItWorks}>
      <div className={styles.container}>
        <Row>
          <Col sm={7} className={styles.detailed}>
            <h2>{mainTitle}</h2>
            {children}
            { btnType === "normal" && <Button
              bgColor="#741763"
              color="#fff"
              className="mt-4"
            >
              {btnText}
            </Button> }
            { btnType === "textBtn" &&
              <button className={styles.textBtn}>Be the first to know when we launch</button>
            }
          </Col>
          <Col sm={5} className={imageCopy ? styles.imageCopy : styles.steps}>
            { !imageCopy && <>
              <h3>{minorTitle}</h3>
              { steps.map((step, index) => (
                  <div key={index} className={styles.stepGroup}>
                    <BiCheckSquare color="#A02089" className={styles.icon} />
                    <p>{step}</p>
                  </div>
              ))}
            </>}
            { imageCopy && <img src={imageCopy} alt={productName} className={styles.imgCopy} /> }
          </Col>
        </Row>
      </div>
    </div>
  )
}


const EmailSubscription = ({ title }) => {

  const [subscribeEmail, setSubscribeEmail] = useState('');

  return (
    <div className={styles.subscribeEmail}>
      <div className={styles.container}>
        <h2>{title}</h2>
        <div className={styles.emailInput}>
          <input 
            type="email"
            name="subscribeEmail"
            value={subscribeEmail}
            onChange={(e) => setSubscribeEmail(e.currentTarget.value)}
            placeholder="Enter your email"
          />
          <button>
            Subscribe
            <RiSendPlaneFill size="1.2em" className="ml-3" />
          </button>
        </div>
      </div>
    </div>
  )
}


const MenuBox = ({ icon, menuTitle, clicked, menuState }) => {
  
  let strippedTitle = menuTitle.split(' ')[1];
  strippedTitle = strippedTitle.toLowerCase();
  // console.log(strippedTitle);

  return (
    <div 
      className={ menuState === strippedTitle ? styles.activeMenu : styles.menuBox } 
      onClick={clicked}
    >
      <div className={styles.iconWrapper}>
        <img 
          src={icon} 
          alt="Consumer Credit" 
          className={menuTitle === "Gypsy Notes" ? styles.notes : styles.credit} 
        />
      </div>
      <h3>{menuTitle}</h3>
    </div>
  )
}


const Products = ({ history }) => {

  const { url } = useRouteMatch();
  const [menuState, setMenuState] = useState('credit');

  const navigateProducts = (menuAlias) => {
    console.log(menuAlias);
    setMenuState(menuAlias);
  }

  return (
    <>
    <NavBar history={history} location={url} />
    <div className={styles.productsMenu}>
      <div className={styles.container}>
        <Row>
          <Col>
            <MenuBox 
              icon={Credit} 
              menuTitle="Consumer Credit" 
              clicked={() => navigateProducts('credit')} 
              menuState={menuState}
            />
          </Col>
          <Col>
            <MenuBox 
              icon={Notes} 
              menuTitle="Gypsy Notes" 
              clicked={() => navigateProducts('notes')}
              menuState={menuState}
            />
          </Col>
          <Col>
            <MenuBox 
              icon={Advisory} 
              menuTitle="Financial Advisory" 
              clicked={() => navigateProducts('advisory')}
              menuState={menuState}
            />
          </Col>
          <Col>
            <MenuBox 
              icon={Alternative} 
              menuTitle="Alternative Investment" 
              clicked={() => navigateProducts('investment')}
              menuState={menuState}
            />
          </Col>
        </Row>
      </div>
    </div>
    { menuState === 'credit' && <ProductBanner 
      productTitle="Consumer Credit" 
      copy="The extra money for all life's personal needs, Why not?"
      btnType="normal"
      btnText="Apply Now!"
    /> }
    { menuState === 'notes' && <ProductBanner 
      productTitle="Gypsy Notes" 
      copy="Enjoy capital retention and attractive returns on your investment"
      btnType="textButton"
    /> }
    { menuState === 'advisory' && <ProductBanner 
      productTitle="Financial Advisory" 
      copy="Optimum advice on a wide range of strategic and financial goals"
      btnType="normal"
      btnText="Book an Appointment"
    /> }
    { menuState === 'investment' && <ProductBanner 
      productTitle="Alternative Investment" 
      copy="For investors who seek greater rewards"
      btnType="textButton"
    /> }
    { menuState === "credit" && <div className={styles.features}>
      <div className={styles.container}>
        <Row>
          <Col>
            <div className={styles.iconWrapper}>
              <img src={Funding} alt="Fast funding" />
            </div>
            <h3>Funding Capacity</h3>
            <p>Up to ₦500,000</p>
          </Col>
          <Col>
            <div className={styles.iconWrapper}>
              <img src={Accept} alt="terms" />
            </div>
            <h3>Term</h3>
            <p>Up to 6 months</p>
          </Col>
          <Col>
            <div className={styles.iconWrapper}>
              <img src={Calendar} alt="schedule" />
            </div>
            <h3>Payment Schedule</h3>
            <p>Monthly</p>
          </Col>
          <Col>
            <div className={styles.iconWrapper}>
              <img src={Time} alt="speed" />
            </div>
            <h3>Speed</h3>
            <p>As fast as 24 hours</p>
          </Col>
        </Row>
      </div>
    </div>}
    { menuState === "credit" && <HowItWorks 
      mainTitle="Convenient personal and lifestyle loans."
      minorTitle="How It Works"
      btnText="Apply Now!"
      btnType="normal"
      productName="Consumer Credit"
      steps={["Create a free Gypsy account", "Complete our online application", "Receive money within 24 hours if approved."]}
    >
      <p>We are committed to providing consumer loan services, with efficiency and convenience at the forefront of all we do while ensuring best practices.</p>
      <p>We utilize cutting technological solutions with speed and accurate data capturing, simple and secured.</p>
    </HowItWorks>}
    { menuState === "notes" && <HowItWorks 
      mainTitle="Enjoy capital retention and attractive returns on your investment"
      btnText="Apply Now!"
      btnType="normal"
      imageCopy={Customer}
      productName="Gypsy Notes"
    >
      <p>Enjoy capital retention and attractive returns on your investment</p>
      <p>We offer annual returns up to 13% Per Annum which are tiered according to individual preferences with a minimum investment amount of N1million for a minimum tenor of 100 days.</p>
      <p>At Gypsy, we recognize the dynamic nature of the market and help our clientele better manage liquidity with our flexible tenor and structured fixed income services.</p>
    </HowItWorks>}
    { menuState === "advisory" && <HowItWorks 
      mainTitle="Optimum advice on a wide range of strategic and financial goals"
      btnText="Book an Appointment"
      btnType="normal"
      imageCopy={Investor}
      productName="Financial Advisory"
    >
      <p>We provide expert financial advisory and wealth management services to individual lifestyle needs. With a diverse range of industry experts, global knowledge and insight we achieve ranging clientele needs.</p>
      <p>Our understanding of the sub-Saharan market avails us the opportunity to forge possibilities and create values for our interested client’s seeking to explore the market.</p>
    </HowItWorks>}
    { menuState === "investment" && <HowItWorks 
      mainTitle="Earn More…"
      btnType="textBtn"
      productName="Alternative Investment"
      minorTitle="We Primarily Invest Across:"
      steps={[
        "Real estate brokerage, development and financing.",
        "Agriculture and agro-financing.",
        "Hospitality and retail."
      ]}
    >
      <p>This investment arm is driven by our interest in real estate financing, financial services, agriculture and hospitality projects. We are focused on delivering solutions that inspire global possibilities that drive value and growth.</p>
      <p>While we focus our effort on those sectors that are closely geared to our core themes, we are open to investments prospects across other sectors. We select our investment opportunities via expert-led insights and reviews delivered by our network of experienced investment brokers, allowing us to invest in viable opportunities.</p>
      <p>We support our clients at operational and strategic levels, offering day to day advisory services, tailored to their lifestyle needs.</p>
    </HowItWorks>}
    { menuState === "notes" &&
      <EmailSubscription title="Be The First to Know When We Launch Gypsy Notes" />
    }
    { menuState === "investment" &&
      <EmailSubscription title="Be The First to Know When We Launch Alternative Investment" />
    }
    <Footer />
    </>
  )
}


export default Products;