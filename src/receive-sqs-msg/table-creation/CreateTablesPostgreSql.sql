
CREATE SCHEMA IF NOT EXISTS cwd;

-- Table: cwd.cooperator

-- DROP TABLE IF EXISTS cwd.cooperator;

CREATE TABLE IF NOT EXISTS cwd.cooperator
(
  id character varying(50) COLLATE pg_catalog."default" NOT NULL,
	cooperator_type character varying(255) COLLATE pg_catalog."default",
	cooperator_poc_name character varying(255) COLLATE pg_catalog."default",
	cooperator_phone character varying(18) COLLATE pg_catalog."default",
	cooperator_address character varying(255) COLLATE pg_catalog."default",
	cooperator_agfc_point_of_contact character varying(75) COLLATE pg_catalog."default",
	cooperator_county character varying(50) COLLATE pg_catalog."default",
	cooperator_display_id character varying(75) COLLATE pg_catalog."default",
	cooperator_display_name character varying(255) COLLATE pg_catalog."default",
	cooperator_email character varying(255) COLLATE pg_catalog."default",
	cooperator_status character varying(15) COLLATE pg_catalog."default",
	created timestamp with time zone DEFAULT now(),
	created_by_email character varying(255) COLLATE pg_catalog."default",
	created_by_id character varying(50) COLLATE pg_catalog."default",
	modified timestamp with time zone DEFAULT now(),
	modified_by_email character varying(255) COLLATE pg_catalog."default",
	modified_by_id character varying(50) COLLATE pg_catalog."default",
  CONSTRAINT pk_cooperator_id PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS cwd.cooperator
    OWNER to agfc_cwd;	


-- Table: cwd.lab_submission

-- DROP TABLE IF EXISTS cwd.lab_submission;

CREATE TABLE IF NOT EXISTS cwd.lab_submission
(
  id character varying(50) COLLATE pg_catalog."default" NOT NULL,
	ls_date_shipped date,
	ls_laboratory character varying(75) COLLATE pg_catalog."default",
	ls_tracking_number character varying(50) COLLATE pg_catalog."default",
	ls_tray_number character varying(25) COLLATE pg_catalog."default",
	created timestamp with time zone DEFAULT now(),
	created_by_email character varying(255) COLLATE pg_catalog."default",
	created_by_id character varying(50) COLLATE pg_catalog."default",
	modified timestamp with time zone DEFAULT now(),
	modified_by_email character varying(255) COLLATE pg_catalog."default",
	modified_by_id character varying(50) COLLATE pg_catalog."default",
  CONSTRAINT pk_lab_submission_id PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS cwd.lab_submission
    OWNER to agfc_cwd;	
	
-- Table: cwd.lab_result

-- DROP TABLE IF EXISTS cwd.lab_result;

CREATE TABLE IF NOT EXISTS cwd.lab_result
(
  id character varying(50) COLLATE pg_catalog."default" NOT NULL,
	lr_accession_number character varying(25) COLLATE pg_catalog."default",
	created timestamp with time zone DEFAULT now(),
	created_by_email character varying(255) COLLATE pg_catalog."default",
	created_by_id character varying(50) COLLATE pg_catalog."default",
	modified timestamp with time zone DEFAULT now(),
	modified_by_email character varying(255) COLLATE pg_catalog."default",
	modified_by_id character varying(50) COLLATE pg_catalog."default",
  CONSTRAINT pk_lab_result PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS cwd.lab_result
    OWNER to agfc_cwd;	

-- Table: cwd.cwd_sample

-- DROP TABLE IF EXISTS cwd.cwd_sample;

CREATE TABLE IF NOT EXISTS cwd.cwd_sample
(
  id character varying(50) COLLATE pg_catalog."default" NOT NULL,
	cervid_age character varying(10) COLLATE pg_catalog."default",
	cervid_sex character varying(15) COLLATE pg_catalog."default",
	cervid_type character varying(30) COLLATE pg_catalog."default",
	contact_address character varying(255) COLLATE pg_catalog."default",
	contact_city character varying(75) COLLATE pg_catalog."default",
	contact_email character varying(255) COLLATE pg_catalog."default",
	contact_first_name character varying(50) COLLATE pg_catalog."default",
	contact_last_name character varying(50) COLLATE pg_catalog."default",
	contact_middle_initial character varying(5) COLLATE pg_catalog."default",
	contact_phone character varying(18) COLLATE pg_catalog."default",
	contact_state character varying(22) COLLATE pg_catalog."default",
	contact_zip_code character varying(15) COLLATE pg_catalog."default",
	cooperator character varying(255) COLLATE pg_catalog."default",
	county_of_harvest character varying(50) COLLATE pg_catalog."default",
	county_of_sample character varying(50) COLLATE pg_catalog."default",
	cwd_private_lands boolean DEFAULT false,
	cwd_sample_comments text COLLATE pg_catalog."default",
	cwd_sample_id character varying(25) COLLATE pg_catalog."default",
	cwd_sample_record_season character varying(10) COLLATE pg_catalog."default",
	cwd_sample_status character varying(18) COLLATE pg_catalog."default",
	date_of_collection date,
	game_check_id character varying(20) COLLATE pg_catalog."default",
	genetics_data_collected boolean DEFAULT false,
	dmap boolean DEFAULT false,	
	hunter_cid character varying(20) COLLATE pg_catalog."default",
	sample_type character varying(20) COLLATE pg_catalog."default",
	utm_easting bigint,
	utm_northing bigint,
	utm_zone character varying(10) COLLATE pg_catalog."default",
	letter_sent_date date,
	meat_at_processor character varying(10) COLLATE pg_catalog."default",
	meat_kept_or_relinquished character varying(10) COLLATE pg_catalog."default",
	meat_replacement_tag_requested boolean DEFAULT false,
	plan_for_disposal character varying(25) COLLATE pg_catalog."default",
	tag_issued_date date,
	private_status boolean DEFAULT false,
	valid_cervid_sex character varying(15) COLLATE pg_catalog."default",
	valid_contact_address character varying(255) COLLATE pg_catalog."default",
	valid_contact_city character varying(75) COLLATE pg_catalog."default",
	valid_contact_email character varying(255) COLLATE pg_catalog."default",
	valid_contact_first_name character varying(50) COLLATE pg_catalog."default",
	valid_contact_last_name character varying(50) COLLATE pg_catalog."default",
	valid_contact_middle_initial character varying(5) COLLATE pg_catalog."default",
	valid_contact_phone character varying(18) COLLATE pg_catalog."default",
	valid_contact_state character varying(22) COLLATE pg_catalog."default",
	valid_contact_zip_code character varying(15) COLLATE pg_catalog."default",
	valid_county_of_harvest character varying(50) COLLATE pg_catalog."default",
	valid_date_of_collection date,
	valid_game_check_id character varying(20) COLLATE pg_catalog."default",
	valid_hunter_cid character varying(20) COLLATE pg_catalog."default",
	created timestamp with time zone DEFAULT now(),
	created_by_email character varying(255) COLLATE pg_catalog."default",
	created_by_id character varying(50) COLLATE pg_catalog."default",
	modified timestamp with time zone DEFAULT now(),
	modified_by_email character varying(255) COLLATE pg_catalog."default",
	modified_by_id character varying(50) COLLATE pg_catalog."default",
  CONSTRAINT pk_cwd_sample PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS cwd.cwd_sample
    OWNER to agfc_cwd;	


-- Table: cwd.cwd_sample_contact

-- DROP TABLE IF EXISTS cwd.cwd_sample_contact;

CREATE TABLE IF NOT EXISTS cwd.cwd_sample_contact
(
	id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
	cwd_sample_id character varying(50) COLLATE pg_catalog."default",
	contact_date timestamp with time zone,
	contacted character varying(10) COLLATE pg_catalog."default",
  CONSTRAINT pk_cwd_sample_record_contact PRIMARY KEY (id),
	CONSTRAINT fk_cwd_sample_contact_cwd_Sample_id FOREIGN KEY (cwd_sample_id)
        REFERENCES cwd.cwd_sample (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS cwd.cwd_sample_contact
    OWNER to agfc_cwd;	

-- Table: cwd.lab_result_cwd_sample

-- DROP TABLE IF EXISTS cwd.lab_result_cwd_sample;

CREATE TABLE IF NOT EXISTS cwd.lab_result_cwd_sample
(
  id character varying(50) COLLATE pg_catalog."default" NOT NULL,
	lr_accession_number character varying(25) COLLATE pg_catalog."default",
	cwd_sample_id character varying(50) COLLATE pg_catalog."default",
	lr_comments text COLLATE pg_catalog."default",
	lr_date_finalized date,
	lr_date_received date,
	lr_lymph_node character varying(50) COLLATE pg_catalog."default",
	lr_obex character varying(50) COLLATE pg_catalog."default",
	lr_od character varying(50) COLLATE pg_catalog."default",
	lr_specimen_description character varying(50) COLLATE pg_catalog."default",
	lr_specimen_id character varying(50) COLLATE pg_catalog."default",
	lr_email_sent boolean DEFAULT false,
	created timestamp with time zone DEFAULT now(),
	created_by_email character varying(255) COLLATE pg_catalog."default",
	created_by_id character varying(50) COLLATE pg_catalog."default",
	modified timestamp with time zone DEFAULT now(),
	modified_by_email character varying(255) COLLATE pg_catalog."default",
	modified_by_id character varying(50) COLLATE pg_catalog."default",
  CONSTRAINT pk_lab_result_cwd_sample PRIMARY KEY (id),
	CONSTRAINT fk_lab_result_cwd_sample_cwd_sample_id FOREIGN KEY (cwd_sample_id)
        REFERENCES cwd.cwd_sample (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION	
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS cwd.lab_result_cwd_sample
    OWNER to agfc_cwd;	

-- Table: cwd.lab_submission_cwd_sample

-- DROP TABLE IF EXISTS cwd.lab_submission_cwd_sample;

CREATE TABLE IF NOT EXISTS cwd.lab_submission_cwd_sample
(
	lab_submission_id character varying(50) COLLATE pg_catalog."default" NOT NULL,
	cwd_sample_id character varying(50) COLLATE pg_catalog."default" NOT NULL,
	created timestamp with time zone DEFAULT now(),
	created_by_email character varying(255) COLLATE pg_catalog."default",
	created_by_id character varying(50) COLLATE pg_catalog."default",
	modified timestamp with time zone DEFAULT now(),
	modified_by_email character varying(255) COLLATE pg_catalog."default",
	modified_by_id character varying(50) COLLATE pg_catalog."default",
  CONSTRAINT pk_lab_submission_cwd_sample PRIMARY KEY (lab_submission_id, cwd_sample_id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS cwd.lab_submission_cwd_sample
    OWNER to agfc_cwd;	
	
-- DROP TABLE IF EXISTS cwd.county_quota;

CREATE TABLE IF NOT EXISTS cwd.county_quota
(
	county character varying(50) COLLATE pg_catalog."default" NOT NULL,
	season character varying(10) COLLATE pg_catalog."default" NOT NULL,
	quota integer NULL,
	created timestamp with time zone DEFAULT now(),
	created_by_email character varying(255) COLLATE pg_catalog."default",
	created_by_id character varying(50) COLLATE pg_catalog."default",
	modified timestamp with time zone DEFAULT now(),
	modified_by_email character varying(255) COLLATE pg_catalog."default",
	modified_by_id character varying(50) COLLATE pg_catalog."default",
  CONSTRAINT pk_county_quota PRIMARY KEY (county, season)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS cwd.county_quota
    OWNER to agfc_cwd;	
