--
-- PostgreSQL database dump
--

-- Dumped from database version 14.2 (Debian 14.2-1.pgdg110+1)
-- Dumped by pg_dump version 14.2

-- Started on 2022-05-15 16:09:41 UTC

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'SQL_ASCII';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 211 (class 1259 OID 16396)
-- Name: following; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.following (
    follower_username text,
    followee_username text
);


ALTER TABLE public.following OWNER TO "user";

--
-- TOC entry 210 (class 1259 OID 16391)
-- Name: post; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.post (
    username text,
    image_url text
);


ALTER TABLE public.post OWNER TO "user";

--
-- TOC entry 209 (class 1259 OID 16386)
-- Name: user; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public."user" (
    username text,
    avatar_url text
);


ALTER TABLE public."user" OWNER TO "user";

--
-- TOC entry 3315 (class 0 OID 16396)
-- Dependencies: 211
-- Data for Name: following; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.following (follower_username, followee_username) FROM stdin;
\.


--
-- TOC entry 3314 (class 0 OID 16391)
-- Dependencies: 210
-- Data for Name: post; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.post (username, image_url) FROM stdin;
\.


--
-- TOC entry 3313 (class 0 OID 16386)
-- Dependencies: 209
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public."user" (username, avatar_url) FROM stdin;
pepepepepe	hfhfhospp
pepepepepe	hfhfhospp
pepepepepe	hfhfhospp
\.


-- Completed on 2022-05-15 16:09:41 UTC

--
-- PostgreSQL database dump complete
--

