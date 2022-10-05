import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

//IMPORTING STYLESHEET

import "../styles/patterns/modal.scss";

//IMPORTING COMPONENTS

import { Button, Text } from "../components";

//IMPORTING MEDIA ASSETS

import check_big from "../assets/icons/check_big.svg";
import error_outline from "../assets/icons/error_outline.svg";
import lock from "../assets/icons/lock.svg";
import transactionComplete from "../assets/abstracts/transactionComplete.svg";
import transactionIncomplete from "../assets/abstracts/transactionIncomplete.svg";
import transactionProcessing from "../assets/abstracts/transactionProcessing.svg";
import facebook from "../assets/icons/facebook.svg";
import instagram from "../assets/icons/instagram.svg";
import telegram from "../assets/icons/telegram.svg";
import twitter from "../assets/icons/twitter.svg";
import youtube from "../assets/icons/youtube.svg";
import MailchimpSubscribe from "react-mailchimp-subscribe";
import { EXPLORER } from "../utils/config";
import { CustomConfetti } from "./Confetti";

const postUrl = `https://cryptosi.us2.list-manage.com/subscribe/post?u=${process.env.REACT_APP_MAILCHIMP_U}&id=${process.env.REACT_APP_MAILCHIMP_ID}`;

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modal = {
  hidden: { opacity: 0, transform: "translate(-50%, -50%) scale(2)" },
  visible: {
    opacity: 1,
    transform: "translate(-50%, -50%) scale(1)",
    transition: { delay: 0.25 },
  },
  exit: {
    opacity: 0,
    transform: "translate(-50%, -50%) scale(0)",
    top: "-100vh",
  },
};

const Prompt = ({
  variant,
  isModal,
  errorMessage,
  processContent,
  successContent = "",
  handleAbort,
  name = "",
  transaction = null,
  chainId
}) => {
  const [showConfetti, setShowConfetti] = useState(true)
  useEffect(() => {
    if(isModal && variant === 'success'){
      // console.log("mounted prompt", isModal, variant)
      return setTimeout(() => {
        setShowConfetti(false)
      }, 5000)
    }
    else setShowConfetti(true)
  }, [isModal, variant])
  // if(variant === "success" && isModal === true) console.log("mounted prompt ==============")
  const renderTitle = () => {
    switch (variant) {
      case "success":
        return "Transaction Complete";
      case "error":
        return "Transaction Incomplete";
      default:
        return "Transaction Processing";
    }
  };

  const renderContent = () => {
    switch (variant) {
      case "success":
        return successContent;
      case "error":
        return "Transaction failed!";
      default:
        return processContent;
    }
  };

  const renderFooterImage = () => {
    switch (variant) {
      case "success":
        return check_big;
      case "error":
        return error_outline;
      default:
        return lock;
    }
  };

  const renderIllustration = () => {
    switch (variant) {
      case "success":
        return transactionComplete;
      case "error":
        return transactionIncomplete;
      default:
        return transactionProcessing;
    }
  };
  const [expand, setExpand] = useState(false)
  const CustomForm = ({ status, message, onValidated }) => {

    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      email && email.indexOf("@") > -1 &&
        onValidated({
          EMAIL: email,
        });
    }

    return (
      <form
        className=""
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="subscribe">
          <input type="email" name="email" className="rounded-lg flex-grow min-w-[140px]" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button variant="primary" type="submit">Subscribe</Button>
        </div>
        {status === "sending" && (
          <div className="text-[#F09132]">
            sending...
          </div>
        )}
        {status === "error" && (
          <div
            className="error"
            dangerouslySetInnerHTML={{ __html: message }}
          />
        )}
        {status === "success" && (
          <div
            className="success"
            dangerouslySetInnerHTML={{ __html: message }}
          />
        )}
      </form>
    );
  };
  return (
    <AnimatePresence>
      {isModal && (
        <motion.div
          className="backdrop"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className="payment_modal"
            variants={modal}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {variant === "success" && <Button style={{ zIndex: 9999 }} variant="btn_close secondary" type="button" onClick={handleAbort}>
              <svg className="square-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            </Button>}
            <div className="image">
              <img src={renderIllustration()} alt="illustration" />
            </div>
            <p className={`title ${variant}`}>{renderTitle()}</p>
            <Text>{errorMessage ? errorMessage : renderContent()}</Text>
            <div className="flex">
              <img src={renderFooterImage()} alt="icon" />
              {variant === "error" ? (
                <Text style={{ color: "#FF7360", fontweight: 500 }}>
                  Error code #12315
                </Text>
              ) : (
                <Text style={{ fontweight: 500 }}>
                  Secure Transaction By Metamask
                </Text>
              )}
            </div>
            {variant === "success" && (
              <div className="social_panel">
                {name !== "" && transaction !== null && <div className="social_icons">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${EXPLORER[chainId]}/tx/${transaction.transactionHash}&quote=We%20have%20just%20started%20this%20auction%20for%20"${name}"%20via%20app.bidify.org`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={facebook} alt="facebook" />
                  </a>
                  <a
                    href={`https://t.me/share/url?url=${EXPLORER[chainId]}/tx/${transaction.transactionHash}&text=We%20have%20just%20started%20this%20auction%20for%20"${name}"%20via%20app.bidify.org`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={telegram} alt="telegram" />
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${EXPLORER[chainId]}/tx/${transaction.transactionHash}&text=We%20have%20just%20started%20this%20auction%20for%20"${name}"%20via%20app.bidify.org`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={twitter} alt="twitter" />
                  </a>
                </div>}
                <div className="social_panel mt-1">
                  <Button variant="expand_btn secondary" onClick={() => setExpand(value => !value)}>
                  {!expand ? "Expand" : "Hide"}
                  {!expand ?
                    <svg viewBox="0 0 24 24" color="text" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="M8.11997 9.29006L12 13.1701L15.88 9.29006C16.27 8.90006 16.9 8.90006 17.29 9.29006C17.68 9.68006 17.68 10.3101 17.29 10.7001L12.7 15.2901C12.31 15.6801 11.68 15.6801 11.29 15.2901L6.69997 10.7001C6.30997 10.3101 6.30997 9.68006 6.69997 9.29006C7.08997 8.91006 7.72997 8.90006 8.11997 9.29006Z"></path></svg> :
                    <svg viewBox="0 0 24 24" color="text" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="M8.11997 14.7101L12 10.8301L15.88 14.7101C16.27 15.1001 16.9 15.1001 17.29 14.7101C17.68 14.3201 17.68 13.6901 17.29 13.3001L12.7 8.7101C12.31 8.3201 11.68 8.3201 11.29 8.7101L6.69997 13.3001C6.30997 13.6901 6.30997 14.3201 6.69997 14.7101C7.08997 15.0901 7.72997 15.1001 8.11997 14.7101Z"></path></svg>
                  }
                  </Button>
                  {expand && <div className="w-full">
                    <div className="follow_section">
                      <div>
                        <p>Follow our socials:</p>
                        <a href="https://twitter.com/Crypto_SI" target="_blank" rel="noreferrer">
                          <img src={twitter} alt="social" />
                        </a>
                        <a href="https://www.instagram.com/cryptosi.eth" target="_blank" rel="noreferrer">
                          <img src={instagram} alt="social" />
                        </a>
                        <a href="https://www.youtube.com/channel/UCcOzf3f6ZWVlIu-6qQpjudA" target="_blank" rel="noreferrer">
                          <img src={youtube} alt="social" />
                        </a>
                      </div>
                      <a href="https://discord.bidify.org" target="_blank" rel="noreferrer" >
                        <Button variant='primary'>Join our discord</Button>
                      </a>
                    </div>
                    <div className="mailing_list">
                      <p>Join our email list for future updates</p>
                      <MailchimpSubscribe
                        url={postUrl}
                        render={({ subscribe, status, message }) => (
                          <CustomForm
                            status={status}
                            message={message}
                            onValidated={formData => subscribe(formData)}
                          />
                        )}
                      />
                    </div>
                  </div>}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
      {variant === 'success' && showConfetti && isModal && <CustomConfetti />}
    </AnimatePresence>
  );
};

export default Prompt;
