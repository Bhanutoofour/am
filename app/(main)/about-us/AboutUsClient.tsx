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
      <h1 className={styles.pageTitle}>
        {`Engineering Machines\nfor Real Field Work.`}
      </h1>
      <div className={styles.collageContainer}>
        {ABOUTUSGRID.map((item, idx) => (
          <div key={`${idx} grid`} className={styles.item}>
            <Image
              src={item}
              alt="Autocracy Machinery team and manufacturing collage"
              width={248}
              height={226}
              className={styles.collageImage}
            />
          </div>
        ))}
      </div>

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
              To be a trusted global manufacturer of intelligent, sustainable,
              and field-proven machinery for trenching, infrastructure, water
              management, agriculture, and environmental applications.
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
              To design and manufacture high-performance, cost-effective
              machinery that improves productivity, precision, and project
              execution for contractors, farmers, municipalities, and EPC teams.
            </p>
          </div>
        </div>

        <div className={styles.valuesCard}>
          <p className={styles.introText}>
            {`Every bolt, every weld, every\ninnovation carries a single mark -`}
          </p>
          <h3 className={styles.mainTitle}>
            {`Make in India and Made for the World.`}
          </h3>
        </div>
      </div>

      <div className={styles.teamSection}>
        <div className={styles.headerSection}>
          <h2 className={styles.headerTitle}>
            We Build Trenchers and Utility Machines for the Work That Matters
          </h2>
          <div className={styles.headerDescription}>
            <p>
              Autocracy Machinery is a Made-in-India machinery manufacturer
              building trenchers, tractor attachments, aquatic weed harvesters,
              forklifts, and utility equipment for telecom, solar, water
              management, agriculture, defence, and construction projects.
            </p>
            <p>
              Based in Hyderabad with ISO 9001 certification, we build rugged,
              field-ready machines that help teams lay cables, cut trenches,
              clean water bodies, move materials, and complete projects with
              better control.
            </p>
          </div>
        </div>

        <div className={styles.contentSection}>
          <div className={styles.textContent}>
            <h3 className={styles.sectionTitle}>
              Our Journey in Specialised Machinery Manufacturing
            </h3>
            <div className={styles.sectionText}>
              <p>
                <strong>
                  Our journey is shaped by practical engineering, application
                  knowledge, and the discipline to solve field problems that
                  standard machines often miss.
                </strong>
              </p>
              <p>
                Driven by a vision of strengthening India's self-reliance, we
                design, test, and refine machines for real soil conditions,
                route constraints, water bodies, and operating environments.
              </p>
              <p>
                With 40+ models across 13 product lines and a presence across
                India and global markets, our solutions remain durable,
                serviceable, and proudly indigenous.
              </p>
            </div>
          </div>
          <div className={styles.imageContent}>
            <Image
              src={ABOUTUSTEAM.TEAMIAMGE_1}
              alt="Autocracy Machinery engineering and manufacturing team"
              width={500}
              height={400}
              className={styles.contentImage}
            />
          </div>
        </div>

        <div className={styles.contentSection}>
          <div className={styles.textContent}>
            <h3 className={styles.sectionTitle}>Our Legacy of Innovation</h3>
            <div className={styles.sectionText}>
              <p>
                <strong>
                  Innovation means building equipment that improves how people
                  trench, lift, clean, harvest, move, and maintain field assets.
                </strong>
              </p>
              <p>
                We have introduced import-replacement machines, compact
                trenching solutions, water body cleaning equipment, and
                application-specific attachments for demanding project sites.
              </p>
              <p>
                Our legacy is shaped by practical breakthroughs that improve
                capability, reduce manual work, and help customers finish
                projects with greater consistency.
              </p>
            </div>
          </div>
          <div className={styles.imageContent}>
            <Image
              src={ABOUTUSTEAM.TEAMIAMGE_2}
              alt="Specialised machinery innovation at Autocracy Machinery"
              width={500}
              height={400}
              className={styles.contentImage}
            />
          </div>
        </div>

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
                We believe that bringing together people with different
                backgrounds, experiences, and skills, including strong gender
                representation across technical and leadership roles, leads to
                richer ideas and stronger outcomes.
              </p>
              <p>
                This diversity improves problem-solving, strengthens
                collaboration, and raises the quality of every machine and
                customer solution we create.
              </p>
            </div>
          </div>
          <div className={styles.imageContent}>
            <Image
              src={ABOUTUSTEAM.TEAMIAMGE_3}
              alt="Diverse Autocracy Machinery team"
              width={500}
              height={400}
              className={styles.contentImage}
            />
          </div>
        </div>
      </div>

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

      <div className={styles.initiativesSection}>
        <div className={styles.initiativesHeader}>
          <h2 className={styles.initiativesTitle}>The Initiatives</h2>
          <p className={styles.initiativesDescription}>
            We are Autocracy Machinery Private Limited, a Hyderabad-based ISO
            9001 certified manufacturer of trenchers, attachments, aquatic
            cleaning machines, and infrastructure equipment.
          </p>
        </div>
        <div className={styles.initiativesMarqueeContainer}>
          <div className={styles.initiativesMarqueeTrack}>
            {[...MARQUEE_IMAGES, ...MARQUEE_IMAGES].map((image, idx) => (
              <div key={idx} className={styles.initiativesImageWrapper}>
                <Image
                  src={image}
                  alt={`Autocracy Machinery initiative ${idx + 1}`}
                  width={400}
                  height={300}
                  className={styles.initiativesImage}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

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
            alt="Autocracy Machinery quality, service, innovation, and field performance"
            width={600}
            height={600}
            className={styles.excellenceImage}
          />
        </div>
      </div>

      <Recognitions
        data={AwardsData}
        title="Awards"
        conatinerClassName={styles.aboutUsAwards}
      />
    </div>
  );
};

export default AboutUsClient;
