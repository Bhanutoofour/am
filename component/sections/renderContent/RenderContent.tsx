import React from 'react';
import styles from './renderStyles.module.scss';
import Image from 'next/image';
import { ICONS } from '@/constants/Images/images';

interface RenderContentProps {
    data: PrivacyPolicy | TermsAndConditions
}

const RenderContent: React.FC<RenderContentProps> = ({data}) => {
  return (
    <div className={styles.privacyPolicyCont}>
      <div className={styles.Intro}>
        <h1>{data.title}</h1>
        <p>{data.intro}</p>
      </div>
      <Image src={ICONS.YELLOW_BAR} alt="yellow bar" width={200} height={13} className={styles.yellowBar}/>
      <div className={styles.sections}>
        {data.sections.map((section, i) => (
          <div key={i}>
            <h2>{section.heading}</h2>
            {section.content.map((block, j) =>
              block.type === "paragraph" ? (
                <p key={j}>{block.text}</p>
              ) : (
                <ul key={j}>
                  {block.items?.map((item, k) => (
                    <li key={k}>{item}</li>
                  ))}
                </ul>
              )
            )}
          </div>
        ))}
      </div>
      <div className={styles.contactUs}>
        <h2>Contact Us</h2>
        <p style={{ marginBottom: "1rem"}}>For any questions, concerns, or data-related requests, please contact:</p>
        <div>
            <h5>{data.contact.companyName}</h5>
            <p>{data.contact.email}</p>
            <p>{data.contact.address}</p>
        </div>
      </div>
      <Image src={ICONS.CORNER_RIGHT} alt="section corners" width={150} height={150} style={{ position: "absolute"}} className={styles.left1} />
      <Image src={ICONS.CORNER_RIGHT} alt="section corners" width={150} height={150} style={{ position: "absolute"}} className={styles.left2} />
      <Image src={ICONS.CORNER_RIGHT} alt="section corners" width={150} height={150} style={{ position: "absolute"}} className={styles.right1} />
      <Image src={ICONS.CORNER_RIGHT} alt="section corners" width={150} height={150} style={{ position: "absolute"}} className={styles.right2} />
      </div>
  )
}

export default RenderContent
