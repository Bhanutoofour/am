"use client";
import React from "react";
import styles from "./aboutStyles.module.scss";
import {
  ABOUTUSGRID,
  ABOUTUSTEAM,
  ICONS,
  HEADERS_ICON,
  FOUNDERSDATA,
  MARQUEE_IMAGES,
  EXCELLENCE_DATA,
} from "@/constants/Images/images";
import Image from "next/image";
import { AwardsData } from "@/data/recognitionsData";
import Recognitions from "@/component/sections/recognitions/Recognitions";

const AboutUsClient = () => {
  return (
    <div className={styles.aboutUsContainer}>
      <h1
        className={styles.pageTitle}
      >{`Machines That Build.\nInnovation That Lasts.`}</h1>
      <div className={styles.collageContainer}>
        {ABOUTUSGRID.map((item, idx) => {
          return (
            <div key={`${idx} grid`} className={styles.item}>
              <Image
                src={item}
                alt={"team collage"}
                width={248}
                height={226}
                className={styles.collageImage}
              />
            </div>
          );
        })}
      </div>

      {/* Vision, Mission and Values Section */}
      <div className={styles.missionVisionSection}>
        <div className={styles.missionVisionCard}>
          <div className={styles.iconWrapper}>
            <Image
              src={ICONS.VISION_ICON}
              alt="Vision Icon"
              width={80}
              height={80}
              className={styles.icon}
            />
          </div>
          <div className={styles.content}>
            <h3 className={styles.cardTitle}>Our Vision</h3>
            <p className={styles.cardDescription}>
              To be the world's most trusted source for intelligent and
              sustainable machinery – where every machine built reflects
              superior quality, efficiency, and innovation.
            </p>
          </div>
        </div>

        <div className={styles.missionVisionCard}>
          <div className={styles.iconWrapper}>
            <Image
              src={ICONS.MISSON_ICON}
              alt="Mission Icon"
              width={80}
              height={80}
              className={styles.icon}
            />
          </div>
          <div className={styles.content}>
            <h3 className={styles.cardTitle}>Our Mission</h3>
            <p className={styles.cardDescription}>
              To design and deliver high-performance, cost-effective machinery
              that drives productivity, precision, and progress – empowering
              industries worldwide with Indian engineering excellence.
            </p>
          </div>
        </div>

        <div className={styles.valuesCard}>
          <p className={styles.introText}>
            {`Every bolt, every weld, every\ninnovation carries a single mark –`}
          </p>
          <h3 className={styles.mainTitle}>
            {`Make in India and Made for the World.`}
          </h3>
        </div>
      </div>

      <div className={styles.teamSection}>
        {/* Header Section */}
        <div className={styles.headerSection}>
          <h2 className={styles.headerTitle}>
            We Build the Machines That Build the Nation
          </h2>
          <div className={styles.headerDescription}>
            <p>
              Autocracy Machinery is a Made-in-India engineering leader
              manufacturing high-performance machines for telecom, water
              management, solar, defence, and environmental sustainability.
            </p>
            <p>
              Based in Hyderabad with ISO 9001 certification, we build rugged,
              field-ready equipment that keeps India connected, powered, and
              progressing.
            </p>
          </div>
        </div>

        {/* Our Journey Section */}
        <div className={styles.contentSection}>
          <div className={styles.textContent}>
            <h3 className={styles.sectionTitle}>
              Our Journey of Engineering Excellence
            </h3>
            <div className={styles.sectionText}>
              <p>
                <strong>
                  Our journey is shaped by an engineering ethos of precision,
                  reliability, and purposeful problem-solving.
                </strong>
              </p>
              <p>
                Driven by a vision of strengthening India’s self-reliance, we
                refine and validate every system to ensure dependable
                performance in real-world conditions.
              </p>
              <p>
                With 40+ models across 13 product lines and a presence in 20+
                states and global markets, our solutions remain cost-effective,
                durable, and proudly indigenous.
              </p>
            </div>
          </div>
          <div className={styles.imageContent}>
            <Image
              src={ABOUTUSTEAM.TEAMIAMGE_1}
              alt="Our Journey of Engineering Excellence"
              width={500}
              height={400}
              className={styles.contentImage}
            />
          </div>
        </div>

        {/* Our Legacy Section */}
        <div className={styles.contentSection}>
          <div className={styles.textContent}>
            <h3 className={styles.sectionTitle}>Our Legacy of Innovation</h3>
            <div className={styles.sectionText}>
              <p>
                <strong>
                  Innovation is where we push boundaries and create what didn’t
                  exist before.
                </strong>
              </p>
              <p>
                We have introduced first-of-its-kind concepts, built
                import-replacement solutions, and developed new technologies
                that redefine what specialised machinery can achieve.
              </p>
              <p>
                Our legacy is shaped by breakthroughs that improve capability,
                enhance efficiency, and set new standards for performance.
              </p>
            </div>
          </div>
          <div className={styles.imageContent}>
            <Image
              src={ABOUTUSTEAM.TEAMIAMGE_2}
              alt="Our Legacy of Innovation"
              width={500}
              height={400}
              className={styles.contentImage}
            />
          </div>
        </div>

        {/* Empowered by Diversity Section */}
        <div className={styles.contentSection}>
          <div className={styles.textContent}>
            <h3 className={styles.sectionTitle}>Empowered by Diversity</h3>
            <div className={styles.sectionText}>
              <p>
                <strong>
                  We thrive on the strength of diverse perspectives and
                  inclusive teamwork.
                </strong>
              </p>
              <p>
                OWe firmly believe that bringing together people with different
                backgrounds, experiences, and skills — including strong gender
                representation across technical and leadership roles — leads to
                richer ideas and stronger outcomes.
              </p>
              <p>
                This diversity enhances our problem-solving, strengthens
                collaboration, and elevates the quality of every solution we
                create.
              </p>
            </div>
          </div>
          <div className={styles.imageContent}>
            <Image
              src={ABOUTUSTEAM.TEAMIAMGE_3}
              alt="Empowered by Diversity"
              width={500}
              height={400}
              className={styles.contentImage}
            />
          </div>
        </div>
      </div>

      {/* Founder Section */}
      <div className={styles.founderSection}>
        <h2 className={styles.founderTitle}>
          Our Founders: The Visionaries Behind the Machines
        </h2>
        <div className={styles.foundersContainer}>
          {FOUNDERSDATA.map((founder, index) => (
            <div key={index} className={styles.founderCard}>
              <div className={styles.founderImageWrapper}>
                <Image
                  src={founder.IMAGE}
                  alt={founder.NAME}
                  width={400}
                  height={500}
                  className={styles.founderImage}
                />
                <div className={styles.founderOverlay}>
                  <div className={styles.founderInfo}>
                    <h3 className={styles.founderName}>{founder.NAME}</h3>
                    <p className={styles.founderRole}>{founder.DESIGNATION}</p>
                  </div>
                  <a
                    href={founder.LINKEDIN}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.linkedinIcon}
                  >
                    <Image
                      src={HEADERS_ICON.LinkedIn_YELLOW}
                      alt="LinkedIn"
                      width={40}
                      height={40}
                    />
                  </a>
                </div>
              </div>
              <div className={styles.founderText}>
                <div className={styles.mobileFounderInfo}>
                  <h3 className={styles.mobileFounderName}>{founder.NAME}</h3>
                  <p className={styles.mobileFounderRole}>
                    {founder.DESIGNATION}
                  </p>
                  <a
                    href={founder.LINKEDIN}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.mobileLinkedinIcon}
                  >
                    <Image
                      src={HEADERS_ICON.LinkedIn_YELLOW}
                      alt="LinkedIn"
                      width={40}
                      height={40}
                    />
                  </a>
                </div>
                <p className={styles.founderDescription}>
                  {founder.DESCRIPTION}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Initiatives Section */}
      <div className={styles.initiativesSection}>
        <div className={styles.initiativesHeader}>
          <h2 className={styles.initiativesTitle}>The initiatives</h2>
          <p className={styles.initiativesDescription}>
            We are Autocracy Machinery Private Limited – a Hyderabad-based, ISO
            9001 certified powerhouse of engineering innovation.
          </p>
        </div>
        <div className={styles.initiativesMarqueeContainer}>
          <div className={styles.initiativesMarqueeTrack}>
            {[...MARQUEE_IMAGES, ...MARQUEE_IMAGES].map((image, idx) => (
              <div key={idx} className={styles.initiativesImageWrapper}>
                <Image
                  src={image}
                  alt={`Initiative ${idx + 1}`}
                  width={400}
                  height={300}
                  className={styles.initiativesImage}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pillars of Excellence Section */}
      <div className={styles.excellenceSection}>
        <div className={styles.excellenceContent}>
          <h2 className={styles.excellenceTitle}>Our Pillars of Excellence</h2>
          <div className={styles.pillarsContainer}>
            {EXCELLENCE_DATA.PILLARS.map((pillar, index) => (
              <div key={index} className={styles.pillarItem}>
                <h3 className={styles.pillarTitle}>{pillar.TITLE}</h3>
                <p className={styles.pillarDescription}>{pillar.DESCRIPTION}</p>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.excellenceImageWrapper}>
          <Image
            src={EXCELLENCE_DATA.SECTION_IMAGE}
            alt="Our Pillars of Excellence"
            width={600}
            height={600}
            className={styles.excellenceImage}
          />
        </div>
      </div>

      <Recognitions data={AwardsData} title="Awards" conatinerClassName={styles.aboutUsAwards} />
    </div>
  );
};

export default AboutUsClient;
