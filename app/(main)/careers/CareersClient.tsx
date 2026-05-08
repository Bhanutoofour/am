"use client";
import React from "react";
import styles from "./careersStyles.module.scss";
import Image from "next/image";
import {
  CAREERTEAM,
  IMAGES,
  CAREER_OPPORTUNITIES,
} from "@/constants/Images/images";

const CareersClient = () => {
  return (
    <div className={styles.careersContainer}>
      {/* Hero Section with Image Collage */}
      <section className={styles.heroSection}>
        <div className={styles.collageWrapper}>
          {/* Top Left - team_1 */}
          <div className={`${styles.imageBox} ${styles.topLeft}`}>
            <Image
              src={CAREERTEAM[0]}
              alt="Team Photo 1"
              width={180}
              height={120}
              className={styles.collageImage}
            />
          </div>

          {/* Top Right - team_4 */}
          <div className={`${styles.imageBox} ${styles.topRight}`}>
            <Image
              src={CAREERTEAM[3]}
              alt="Team Photo 4"
              width={200}
              height={140}
              className={styles.collageImage}
            />
          </div>

          {/* Middle Left - team_2 */}
          <div className={`${styles.imageBox} ${styles.middleLeft}`}>
            <Image
              src={CAREERTEAM[1]}
              alt="Team Photo 2"
              width={160}
              height={200}
              className={styles.collageImage}
            />
          </div>

          {/* Bottom Left - team_3 */}
          <div className={`${styles.imageBox} ${styles.bottomLeft}`}>
            <Image
              src={CAREERTEAM[2]}
              alt="Team Photo 3"
              width={280}
              height={180}
              className={styles.collageImage}
            />
          </div>

          {/* Bottom Right - team_5 (large banner) */}
          <div className={`${styles.imageBox} ${styles.bottomRight}`}>
            <Image
              src={CAREERTEAM[4]}
              alt="Team Photo 5"
              width={400}
              height={240}
              className={styles.collageImage}
            />
          </div>

          {/* Center Content */}
          <div className={styles.centerContent}>
            <h1 className={styles.heroTitle}>
              Your Career. Your Impact.
              <br />
              Our Future.
            </h1>
            <a href="#join-section" className={styles.ctaButton}>
              Elevate your journey
            </a>
          </div>
        </div>
      </section>

      {/* Build the Future Section */}
      <section className={styles.buildFutureSection}>
        <h2 className={styles.buildFutureTitle}>
          {"Build the Future\nwith Us"}
        </h2>
        <div className={styles.valuesGrid}>
          <div className={styles.valueCard}>
            <h3 className={styles.valueTitle}>Grow Without Limits</h3>
            <p className={styles.valueDescription}>
              We believe in nurturing talent and celebrating performance. With
              structured development, mentorship programs, and hands-on
              learning, you'll have every opportunity to grow, lead, and make an
              impact.
            </p>
          </div>
          <div className={styles.valueCard}>
            <h3 className={styles.valueTitle}>Innovate Every Day</h3>
            <p className={styles.valueDescription}>
              At Autocracy, innovation isn't a department — it's our culture.
              You'll work with teams that challenge conventions, embrace new
              ideas, and build cutting-edge machinery that defines the future of
              manufacturing.
            </p>
          </div>
          <div className={styles.valueCard}>
            <h3 className={styles.valueTitle}>Make It Matter</h3>
            <p className={styles.valueDescription}>
              We give you the autonomy to own your projects, shape ideas, and
              see them come to life. Every contribution here counts — because
              your work directly fuels progress across industries.
            </p>
          </div>
        </div>
      </section>

      {/* Stories That Inspire Section */}
      <section className={styles.storiesSection}>
        <h2 className={styles.storiesTitle}>Stories That Inspire</h2>
        <div className={styles.testimonialsGrid}>
          <div className={styles.testimonialCard}>
            <Image
              src={IMAGES.QUOTE_ICON_REVERT}
              alt="Quote"
              width={40}
              height={40}
              className={styles.quoteIcon}
            />
            <p className={styles.testimonialText}>
              Working at Autocracy Machinery has been an empowering experience.
              The collaboration and trust within the team encourage me to think
              creatively and deliver excellence. Every challenge is an
              opportunity to grow.
            </p>
            <div className={styles.testimonialAuthor}>
              <p className={styles.authorName}>Anusha</p>
              <p className={styles.authorRole}>Quality Engineer</p>
            </div>
          </div>
          <div className={styles.testimonialCard}>
            <Image
              src={IMAGES.QUOTE_ICON_REVERT}
              alt="Quote"
              width={40}
              height={40}
              className={styles.quoteIcon}
            />
            <p className={styles.testimonialText}>
              Leading as Autocracy Machinery's Head of Production, I'm proud to
              collaborate with visionary leaders and a passionate team that
              drives disruptive innovation. Together, we shape transformative
              initiatives that create real impact.
            </p>
            <div className={styles.testimonialAuthor}>
              <p className={styles.authorName}>Naveen Kumar Poloju</p>
              <p className={styles.authorRole}>Head of Production</p>
            </div>
          </div>
        </div>
      </section>

      {/* Empowered by Diversity Section */}
      <section className={styles.diversitySection}>
        <div className={styles.diversityWrapper}>
          <h2 className={styles.diversityTitle}>Empowered by Diversity</h2>
          <p className={styles.diversityIntro}>
            Different perspectives drive better thinking and stronger results.
            <br />
            We build a workplace where every voice matters and every individual
            is empowered to make an impact.
          </p>
          <div className={styles.diversityContent}>
            <div className={styles.diversityLeft}>
              <div className={styles.diversityImageWrapper}>
                <Image
                  src={IMAGES.CAREER_DIVERSITY}
                  alt="Diverse Team"
                  width={500}
                  height={400}
                  className={styles.diversityImage}
                />
              </div>
            </div>
            <div className={styles.diversityRight}>
              <div className={styles.diversityCard}>
                <h3 className={styles.diversityCardTitle}>
                  Equal Opportunity for All
                </h3>
                <p className={styles.diversityCardText}>
                  <strong>
                    We are committed to providing equal opportunities for all.
                  </strong>{" "}
                  Every individual is treated fairly and with respect, without
                  discrimination of any kind. Our focus remains on skills,
                  integrity, and the ability to contribute meaningfully.
                </p>
              </div>
              <div className={styles.diversityCard}>
                <h3 className={styles.diversityCardTitle}>
                  Gender Diversity & Inclusion
                </h3>
                <p className={styles.diversityCardText}>
                  <strong>
                    We actively support gender diversity across all roles and
                    teams.
                  </strong>{" "}
                  Through inclusive practices, safe work environments, and equal
                  access to opportunities, we ensure that everyone has the
                  freedom to learn, lead, and succeed.
                </p>
              </div>
              <div className={styles.diversityCard}>
                <h3 className={styles.diversityCardTitle}>
                  A Team Across Generations
                </h3>
                <p className={styles.diversityCardText}>
                  <strong>
                    Our teams bring together experience and fresh perspectives.
                  </strong>{" "}
                  By encouraging collaboration across generations, we enable
                  knowledge sharing, mentorship, and continuous
                  learning—building stronger teams and better outcomes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Life at Autocracy Section */}
      <section className={styles.lifeSection}>
        <h2 className={styles.lifeTitle}>Life at Autocracy</h2>
        <p className={styles.lifeIntro}>
          Our culture defines how we work together, make decisions, and grow as
          a team. It is shaped by trust, ownership, learning, and
          accountability—guiding us every day across offices, factories, and
          project sites.
        </p>
        <div className={styles.lifeGrid}>
          <div className={styles.lifeCard}>
            <h3 className={styles.lifeCardTitle}>We Take Ownership</h3>
            <p className={styles.lifeCardText}>
              We take responsibility for outcomes, not just roles. Challenges
              are owned, problems are solved together, and accountability drives
              everything we do.
            </p>
          </div>
          <div className={styles.lifeCard}>
            <h3 className={styles.lifeCardTitle}>We Learn and Improve</h3>
            <p className={styles.lifeCardText}>
              Learning is continuous. We encourage skill development, hands-on
              learning, and leadership growth to help individuals and teams
              evolve with the organisation.
            </p>
          </div>
          <div className={styles.lifeCard}>
            <h3 className={styles.lifeCardTitle}>We Act with Agility</h3>
            <p className={styles.lifeCardText}>
              We adapt, respond, and execute with focus. By embracing practical
              thinking and continuous improvement, we move quickly without
              compromising quality or safety.
            </p>
          </div>
          <div className={styles.lifeCard}>
            <h3 className={styles.lifeCardTitle}>We Build Trust</h3>
            <p className={styles.lifeCardText}>
              Trust is earned through actions. Open communication, respect, and
              transparency shape how we collaborate and support each other every
              day.
            </p>
          </div>
          <div className={styles.lifeCard}>
            <h3 className={styles.lifeCardTitle}>We Work as One Team</h3>
            <p className={styles.lifeCardText}>
              Success here is collective. We share knowledge, celebrate wins
              together, and support each other through challenges—because strong
              teams build strong outcomes.
            </p>
          </div>
          <div className={styles.lifeCard}>
            <h3 className={styles.lifeCardTitle}>Health & Safety First</h3>
            <p className={styles.lifeCardText}>
              Safety is a core value, not a checklist. We prioritise well-being
              through responsible practices and a culture that looks out for
              every individual.
            </p>
          </div>
        </div>
      </section>

      {/* Kickstart Your Journey Section */}
      <section className={styles.kickstartSection}>
        <div className={styles.kickstartWrapper}>
          <h2 className={styles.kickstartTitle}>Kickstart Your Journey</h2>
          <p className={styles.kickstartIntro}>
            Whether you're just beginning or looking to take the next big step,
            Autocracy Machinery offers opportunities that shape your career and
            the future of manufacturing.
          </p>
          <div className={styles.opportunitiesGrid}>
            <div className={styles.opportunityCard}>
              <div className={styles.opportunityContent}>
                <h3 className={styles.opportunityTitle}>Campus Drive</h3>
                <p className={styles.opportunityText}>
                  Our campus hiring programs are conducted to identify potential
                  talent from academic institutions and onboard them into
                  suitable roles. The process includes structured evaluation,
                  induction, and role-specific orientation.
                </p>
              </div>
              <div className={styles.opportunityImageWrapper}>
                <Image
                  src={CAREER_OPPORTUNITIES.CAMPUS_DRIVE}
                  alt="Campus Drive"
                  width={280}
                  height={200}
                  className={styles.opportunityImage}
                />
              </div>
            </div>

            <div className={styles.opportunityCard}>
              <div className={styles.opportunityContent}>
                <h3 className={styles.opportunityTitle}>Internships</h3>
                <p className={styles.opportunityText}>
                  The internship program provides participants with practical
                  exposure through hands-on assignments and live projects.
                  Interns work under professional guidance to gain
                  industry-relevant experience and skills.
                </p>
              </div>
              <div className={styles.opportunityImageWrapper}>
                <Image
                  src={CAREER_OPPORTUNITIES.INTERNSHIPS}
                  alt="Internships"
                  width={280}
                  height={200}
                  className={styles.opportunityImage}
                />
              </div>
            </div>

            <div className={styles.opportunityCard}>
              <div className={styles.opportunityContent}>
                <h3 className={styles.opportunityTitle}>Summer Internship</h3>
                <p className={styles.opportunityText}>
                  This short-term program is conducted during academic breaks
                  and focuses on experiential learning. Participants apply
                  academic concepts to real-world work environments, gaining
                  practical insight and professional exposure.
                </p>
              </div>
              <div className={styles.opportunityImageWrapper}>
                <Image
                  src={CAREER_OPPORTUNITIES.SUMMER_INTERNSHIP}
                  alt="Summer Internship"
                  width={280}
                  height={200}
                  className={styles.opportunityImage}
                />
              </div>
            </div>

            <div className={styles.opportunityCard}>
              <div className={styles.opportunityContent}>
                <h3 className={styles.opportunityTitle}>
                  Full-Time Employment
                </h3>
                <p className={styles.opportunityText}>
                  We offer full-time employment opportunities for candidates
                  seeking long-term careers. Employees are supported through
                  structured onboarding, role-based training, and continuous
                  professional development.
                </p>
              </div>
              <div className={styles.opportunityImageWrapper}>
                <Image
                  src={CAREER_OPPORTUNITIES.FULL_TIME}
                  alt="Full-Time Employment"
                  width={280}
                  height={200}
                  className={styles.opportunityImage}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Our Mission Section */}
      <section id="join-section" className={styles.joinSection}>
        <div className={styles.joinContent}>
          <div className={styles.joinLeft}>
            <h2 className={styles.joinTitle}>Join Our Mission</h2>
            <p className={styles.joinText}>
              If you're passionate about innovation, excellence, and impact —
              Autocracy Machinery is where your ambitions find purpose.
            </p>
            <p className={styles.joinText}>
              Join us, and be part of a team that's shaping the future of
              manufacturing and engineering in India.
            </p>
            <p className={styles.joinLabel}>Send your resume to</p>
            <a
              href="mailto:hiring@autocracymachinery.com"
              className={styles.joinEmail}
            >
              hiring@autocracymachinery.com
            </a>
          </div>
          <div className={styles.joinRight}>
            <Image
              src={IMAGES.JOIN_MISSON}
              alt="Join Our Mission"
              width={450}
              height={350}
              className={styles.joinImage}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default CareersClient;
