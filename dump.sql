--
-- PostgreSQL database dump
--

\restrict nTCc2Q2kn7Ra4Oowttch4uF9rOY0MQGJnFE0UyeqbbYE7hVsfSW9Lr5pOTWPiMH

-- Dumped from database version 16.11 (Ubuntu 16.11-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.11 (Ubuntu 16.11-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: AssignmentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AssignmentStatus" AS ENUM (
    'ACTIVE',
    'RETURNED',
    'USED'
);


ALTER TYPE public."AssignmentStatus" OWNER TO postgres;

--
-- Name: EquipmentType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."EquipmentType" AS ENUM (
    'VEHICLE',
    'WEAPON',
    'AMMUNITION',
    'COMMUNICATION_EQUIPMENT',
    'MEDICAL_SUPPLIES',
    'OTHER'
);


ALTER TYPE public."EquipmentType" OWNER TO postgres;

--
-- Name: PurchaseStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PurchaseStatus" AS ENUM (
    'PENDING',
    'RECEIVED',
    'CANCELED'
);


ALTER TYPE public."PurchaseStatus" OWNER TO postgres;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'ADMIN',
    'BASE_COMMANDER',
    'LOGISTICS_PERSONNEL'
);


ALTER TYPE public."Role" OWNER TO postgres;

--
-- Name: TransactionType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TransactionType" AS ENUM (
    'PURCHASE',
    'TRANSFER_IN',
    'TRANSFER_OUT',
    'EXPENDITURE'
);


ALTER TYPE public."TransactionType" OWNER TO postgres;

--
-- Name: TransferStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TransferStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'COMPLETED',
    'CANCELED'
);


ALTER TYPE public."TransferStatus" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Assignment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Assignment" (
    id text NOT NULL,
    "equipmentId" text NOT NULL,
    "baseId" text NOT NULL,
    "userId" text NOT NULL,
    quantity integer NOT NULL,
    status public."AssignmentStatus" NOT NULL,
    "dateAssigned" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "dateReturned" timestamp(3) without time zone,
    "createdBy" text NOT NULL
);


ALTER TABLE public."Assignment" OWNER TO postgres;

--
-- Name: AuditLog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AuditLog" (
    id text NOT NULL,
    "actorId" text,
    action text NOT NULL,
    entity text,
    "entityId" text,
    payload jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."AuditLog" OWNER TO postgres;

--
-- Name: Base; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Base" (
    id text NOT NULL,
    name text NOT NULL,
    location text NOT NULL,
    "baseCode" text NOT NULL
);


ALTER TABLE public."Base" OWNER TO postgres;

--
-- Name: BaseStock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BaseStock" (
    id text NOT NULL,
    "baseId" text NOT NULL,
    "equipmentId" text NOT NULL,
    "openingQuantity" integer NOT NULL,
    "currentQuantity" integer NOT NULL
);


ALTER TABLE public."BaseStock" OWNER TO postgres;

--
-- Name: Equipment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Equipment" (
    id text NOT NULL,
    name text NOT NULL,
    type public."EquipmentType" NOT NULL
);


ALTER TABLE public."Equipment" OWNER TO postgres;

--
-- Name: Expenditure; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Expenditure" (
    id text NOT NULL,
    "baseId" text NOT NULL,
    "equipmentId" text NOT NULL,
    quantity integer NOT NULL,
    reason text,
    "performedBy" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Expenditure" OWNER TO postgres;

--
-- Name: Purchase; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Purchase" (
    id text NOT NULL,
    "baseId" text NOT NULL,
    "createdBy" text NOT NULL,
    status public."PurchaseStatus" DEFAULT 'PENDING'::public."PurchaseStatus" NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Purchase" OWNER TO postgres;

--
-- Name: PurchaseItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PurchaseItem" (
    id text NOT NULL,
    "purchaseId" text NOT NULL,
    "equipmentId" text NOT NULL,
    quantity integer NOT NULL
);


ALTER TABLE public."PurchaseItem" OWNER TO postgres;

--
-- Name: Transaction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Transaction" (
    id text NOT NULL,
    "txType" public."TransactionType" NOT NULL,
    "baseId" text,
    "equipmentId" text,
    quantity integer NOT NULL,
    "sourceType" text NOT NULL,
    "sourceId" text NOT NULL,
    "performedBy" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Transaction" OWNER TO postgres;

--
-- Name: Transfer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Transfer" (
    id text NOT NULL,
    "fromBaseId" text NOT NULL,
    "toBaseId" text NOT NULL,
    "createdBy" text NOT NULL,
    status public."TransferStatus" DEFAULT 'PENDING'::public."TransferStatus" NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Transfer" OWNER TO postgres;

--
-- Name: TransferItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TransferItem" (
    id text NOT NULL,
    "transferId" text NOT NULL,
    "equipmentId" text NOT NULL,
    quantity integer NOT NULL
);


ALTER TABLE public."TransferItem" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    "hashedPassword" text NOT NULL,
    role public."Role" NOT NULL,
    "baseId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Data for Name: Assignment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Assignment" (id, "equipmentId", "baseId", "userId", quantity, status, "dateAssigned", "dateReturned", "createdBy") FROM stdin;
67641e07-4e83-4149-8d61-bf8a9125c86f	42bb9d45-7ac9-4d07-84e2-dfbc3e44704c	cfe919d4-2ef2-4422-a5ca-32b1385304d9	26df6d65-affb-4328-95b9-b3c4428e7efc	5	ACTIVE	2025-12-14 21:53:56.002	\N	26df6d65-affb-4328-95b9-b3c4428e7efc
cb9b840d-8ecc-4d28-be82-5ed480c9db60	96766a24-40bc-49eb-8dd9-7c8863dc3155	6e3793e8-a7a7-48f2-8f0c-988e90fcfbc2	005bd574-148c-4535-9b42-2447e3969469	5	ACTIVE	2025-12-14 21:53:56.012	\N	005bd574-148c-4535-9b42-2447e3969469
3d995522-ba74-4f9e-aeea-383df7e4d235	0e89739e-a6ae-44b9-b736-027412538ac0	90a7c252-c43d-4141-b1f5-3cab7a8d3c41	a07f3f37-8279-4818-8df2-4bfff9ce0730	5	ACTIVE	2025-12-14 21:53:56.02	\N	a07f3f37-8279-4818-8df2-4bfff9ce0730
ca2edc8a-af89-46e1-b8e7-7c5ad032a53a	3fec0885-c1a8-48f9-ac4b-0d06c68f3c9c	557f073f-c4d2-4f62-a46b-e0079ab25bcf	7eb160c9-214d-4102-9076-c62c8e35ca85	5	ACTIVE	2025-12-14 21:53:56.027	\N	7eb160c9-214d-4102-9076-c62c8e35ca85
296982cc-28d7-4490-990a-21e28a2b67f7	82515df1-d04b-4e64-b1d3-91cbffa6af6c	6258ef8b-e231-4a5d-9a8d-ad0bd048d3aa	1600f213-b5e8-45e4-8028-06cc900794be	5	ACTIVE	2025-12-14 21:53:56.03	\N	1600f213-b5e8-45e4-8028-06cc900794be
16f20496-7038-4d98-9d5d-b23165e10432	2957c115-49a9-4629-a762-c19f2e2550bc	557f073f-c4d2-4f62-a46b-e0079ab25bcf	15d39687-1788-4940-8ef7-06da78e3d2fe	5	ACTIVE	2025-12-15 05:02:12.567	\N	1600f213-b5e8-45e4-8028-06cc900794be
45ac4af2-8c52-4c52-b1b8-8ab2ee1ca99f	f864aee4-4bd0-4af4-8330-dda7264434f7	90a7c252-c43d-4141-b1f5-3cab7a8d3c41	7eb160c9-214d-4102-9076-c62c8e35ca85	12	ACTIVE	2025-12-15 05:05:42.753	\N	1600f213-b5e8-45e4-8028-06cc900794be
\.


--
-- Data for Name: AuditLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AuditLog" (id, "actorId", action, entity, "entityId", payload, "createdAt") FROM stdin;
e2d21976-0653-467c-9a84-0a929ffc9e1d	26df6d65-affb-4328-95b9-b3c4428e7efc	SEED_DATA	SYSTEM	INIT	{"message": "Initial seed data"}	2025-12-14 21:53:56.098
f9ec8851-511d-4370-8d28-3f36422ebaf2	005bd574-148c-4535-9b42-2447e3969469	SEED_DATA	SYSTEM	INIT	{"message": "Initial seed data"}	2025-12-14 21:53:56.183
a0e137c9-24d8-42b6-9a2a-321b46250868	a07f3f37-8279-4818-8df2-4bfff9ce0730	SEED_DATA	SYSTEM	INIT	{"message": "Initial seed data"}	2025-12-14 21:53:56.185
cc85aa49-2196-4e1b-bc4e-3aefa3232d5c	7eb160c9-214d-4102-9076-c62c8e35ca85	SEED_DATA	SYSTEM	INIT	{"message": "Initial seed data"}	2025-12-14 21:53:56.187
c5a34291-03e9-46a1-91f1-6524ff04cb20	1600f213-b5e8-45e4-8028-06cc900794be	SEED_DATA	SYSTEM	INIT	{"message": "Initial seed data"}	2025-12-14 21:53:56.195
e8fc96d2-33a9-4136-8a64-f736de08fc1c	1600f213-b5e8-45e4-8028-06cc900794be	VIEW_PURCHASES	Purchase	\N	{"role": "ADMIN", "baseId": "90a7c252-c43d-4141-b1f5-3cab7a8d3c41", "resultCount": 5}	2025-12-15 04:59:39.683
3ee3370f-77cf-43a3-b6ae-07e42204e289	1600f213-b5e8-45e4-8028-06cc900794be	VIEW_PURCHASES	Purchase	\N	{"role": "ADMIN", "baseId": "90a7c252-c43d-4141-b1f5-3cab7a8d3c41", "resultCount": 5}	2025-12-15 04:59:39.684
6030496f-0556-4985-9a75-966c0b40bfd1	1600f213-b5e8-45e4-8028-06cc900794be	VIEW_TRANSFERS	Transfer	\N	{"role": "ADMIN", "count": 5, "baseId": "90a7c252-c43d-4141-b1f5-3cab7a8d3c41"}	2025-12-15 04:59:49.335
b8bf184d-b384-470d-b42f-9ec8fc35d27d	1600f213-b5e8-45e4-8028-06cc900794be	VIEW_TRANSFERS	Transfer	\N	{"role": "ADMIN", "count": 5, "baseId": "90a7c252-c43d-4141-b1f5-3cab7a8d3c41"}	2025-12-15 04:59:49.336
8be9bbf6-ddbb-4d20-9030-54f381af1f8f	1600f213-b5e8-45e4-8028-06cc900794be	CREATE_ASSIGNMENT	Assignment	16f20496-7038-4d98-9d5d-b23165e10432	{"baseId": "557f073f-c4d2-4f62-a46b-e0079ab25bcf", "userId": "15d39687-1788-4940-8ef7-06da78e3d2fe", "quantity": 5, "equipmentId": "2957c115-49a9-4629-a762-c19f2e2550bc"}	2025-12-15 05:02:12.59
0bb33972-26a4-417e-8819-37acddf41849	1600f213-b5e8-45e4-8028-06cc900794be	VIEW_TRANSFERS	Transfer	\N	{"role": "ADMIN", "count": 5, "baseId": "90a7c252-c43d-4141-b1f5-3cab7a8d3c41"}	2025-12-15 05:02:33.409
88a70453-7837-41c8-952b-0d844cd61bff	1600f213-b5e8-45e4-8028-06cc900794be	VIEW_TRANSFERS	Transfer	\N	{"role": "ADMIN", "count": 5, "baseId": "90a7c252-c43d-4141-b1f5-3cab7a8d3c41"}	2025-12-15 05:02:33.41
361207c1-d745-4ae0-86e8-4dcaba48b6ba	1600f213-b5e8-45e4-8028-06cc900794be	CREATE_ASSIGNMENT	Assignment	45ac4af2-8c52-4c52-b1b8-8ab2ee1ca99f	{"baseId": "90a7c252-c43d-4141-b1f5-3cab7a8d3c41", "userId": "7eb160c9-214d-4102-9076-c62c8e35ca85", "quantity": 12, "equipmentId": "f864aee4-4bd0-4af4-8330-dda7264434f7"}	2025-12-15 05:05:42.759
d753d3d8-4135-4389-9c84-1afe8ec24718	7eb160c9-214d-4102-9076-c62c8e35ca85	VIEW_TRANSFERS	Transfer	\N	{"role": "LOGISTICS_PERSONNEL", "count": 2, "baseId": "6e3793e8-a7a7-48f2-8f0c-988e90fcfbc2"}	2025-12-15 05:06:43.666
07ee429d-7d68-47f8-8bd7-b2581b37378f	7eb160c9-214d-4102-9076-c62c8e35ca85	VIEW_TRANSFERS	Transfer	\N	{"role": "LOGISTICS_PERSONNEL", "count": 2, "baseId": "6e3793e8-a7a7-48f2-8f0c-988e90fcfbc2"}	2025-12-15 05:06:43.694
bf628cdd-7648-4a3d-83c5-8b052126de9d	fbc87c1b-c2fb-4e8f-a919-123568f94a7b	VIEW_PURCHASES	Purchase	\N	{"role": "ADMIN", "baseId": "557f073f-c4d2-4f62-a46b-e0079ab25bcf", "resultCount": 5}	2025-12-15 05:08:06.688
d571baa0-daaf-4564-9f2c-beea7c121b16	fbc87c1b-c2fb-4e8f-a919-123568f94a7b	VIEW_PURCHASES	Purchase	\N	{"role": "ADMIN", "baseId": "557f073f-c4d2-4f62-a46b-e0079ab25bcf", "resultCount": 5}	2025-12-15 05:08:06.691
469b9665-3be4-40b3-b7e6-13c7db0cabd3	fbc87c1b-c2fb-4e8f-a919-123568f94a7b	VIEW_TRANSFERS	Transfer	\N	{"role": "ADMIN", "count": 5, "baseId": "557f073f-c4d2-4f62-a46b-e0079ab25bcf"}	2025-12-15 05:08:14.085
5be33a06-61f7-4be7-9792-ba7e9472d0ae	fbc87c1b-c2fb-4e8f-a919-123568f94a7b	VIEW_TRANSFERS	Transfer	\N	{"role": "ADMIN", "count": 5, "baseId": "557f073f-c4d2-4f62-a46b-e0079ab25bcf"}	2025-12-15 05:08:14.115
\.


--
-- Data for Name: Base; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Base" (id, name, location, "baseCode") FROM stdin;
cfe919d4-2ef2-4422-a5ca-32b1385304d9	Northern Command	Ladakh	NC01
6e3793e8-a7a7-48f2-8f0c-988e90fcfbc2	Western Command	Rajasthan	WC01
90a7c252-c43d-4141-b1f5-3cab7a8d3c41	Eastern Command	Assam	EC01
557f073f-c4d2-4f62-a46b-e0079ab25bcf	Southern Command	Tamil Nadu	SC01
6258ef8b-e231-4a5d-9a8d-ad0bd048d3aa	Central Command	Uttar Pradesh	CC01
\.


--
-- Data for Name: BaseStock; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BaseStock" (id, "baseId", "equipmentId", "openingQuantity", "currentQuantity") FROM stdin;
a4fd25ae-37f6-4cd5-8b84-a05f856e4ea1	cfe919d4-2ef2-4422-a5ca-32b1385304d9	42bb9d45-7ac9-4d07-84e2-dfbc3e44704c	100	100
2bfcb41c-f7f0-4af3-b69a-f03904d4bb07	6e3793e8-a7a7-48f2-8f0c-988e90fcfbc2	42bb9d45-7ac9-4d07-84e2-dfbc3e44704c	100	100
e3041c80-8b33-4226-b110-9b9a3ca5afc3	90a7c252-c43d-4141-b1f5-3cab7a8d3c41	42bb9d45-7ac9-4d07-84e2-dfbc3e44704c	100	100
faac61d3-7e6e-4f15-9df1-4b8dee2f6227	557f073f-c4d2-4f62-a46b-e0079ab25bcf	42bb9d45-7ac9-4d07-84e2-dfbc3e44704c	100	100
35115352-aa78-4dd5-a6ee-90dd8fa5afe8	6258ef8b-e231-4a5d-9a8d-ad0bd048d3aa	42bb9d45-7ac9-4d07-84e2-dfbc3e44704c	100	100
99776d83-1beb-4eeb-a2f7-75a99e6162cc	cfe919d4-2ef2-4422-a5ca-32b1385304d9	96766a24-40bc-49eb-8dd9-7c8863dc3155	100	100
bba1197d-4ec8-492b-8662-85f4b5fc29dd	6e3793e8-a7a7-48f2-8f0c-988e90fcfbc2	96766a24-40bc-49eb-8dd9-7c8863dc3155	100	100
f938c5f5-b7dc-40eb-abaf-4d01ea10c557	90a7c252-c43d-4141-b1f5-3cab7a8d3c41	96766a24-40bc-49eb-8dd9-7c8863dc3155	100	100
1f8f0047-7d6d-4ae7-ae45-a50d94f894ab	557f073f-c4d2-4f62-a46b-e0079ab25bcf	96766a24-40bc-49eb-8dd9-7c8863dc3155	100	100
c4abcce0-0420-41f4-b1a8-4ab838e8deee	6258ef8b-e231-4a5d-9a8d-ad0bd048d3aa	96766a24-40bc-49eb-8dd9-7c8863dc3155	100	100
0df4db83-5ec7-46ed-86f3-64251176ec77	cfe919d4-2ef2-4422-a5ca-32b1385304d9	0e89739e-a6ae-44b9-b736-027412538ac0	100	100
c8bfdb9d-9412-4c01-ba39-6e45fbf666bc	6e3793e8-a7a7-48f2-8f0c-988e90fcfbc2	0e89739e-a6ae-44b9-b736-027412538ac0	100	100
87692b62-7e39-4580-ba02-9d78029e7c9e	90a7c252-c43d-4141-b1f5-3cab7a8d3c41	0e89739e-a6ae-44b9-b736-027412538ac0	100	100
bac51eb3-df7d-47a3-970e-2c043b0072ce	557f073f-c4d2-4f62-a46b-e0079ab25bcf	0e89739e-a6ae-44b9-b736-027412538ac0	100	100
5a3adc39-1485-435c-a78c-821344c66b8d	6258ef8b-e231-4a5d-9a8d-ad0bd048d3aa	0e89739e-a6ae-44b9-b736-027412538ac0	100	100
a61f9bac-de1a-4926-92d8-368a2432d7f7	cfe919d4-2ef2-4422-a5ca-32b1385304d9	3fec0885-c1a8-48f9-ac4b-0d06c68f3c9c	100	100
3376154a-679e-411b-9c92-2e737be3aec0	6e3793e8-a7a7-48f2-8f0c-988e90fcfbc2	3fec0885-c1a8-48f9-ac4b-0d06c68f3c9c	100	100
beb59821-36e2-401f-b2b7-893aaf46c4ca	90a7c252-c43d-4141-b1f5-3cab7a8d3c41	3fec0885-c1a8-48f9-ac4b-0d06c68f3c9c	100	100
23327ebc-5fe2-4b9a-9a78-976a7f7aa3bf	557f073f-c4d2-4f62-a46b-e0079ab25bcf	3fec0885-c1a8-48f9-ac4b-0d06c68f3c9c	100	100
3ad9e9d2-ca2c-4f9c-9179-afc08a373cc7	6258ef8b-e231-4a5d-9a8d-ad0bd048d3aa	3fec0885-c1a8-48f9-ac4b-0d06c68f3c9c	100	100
514e0b14-fbed-4749-857b-b65ef14be0e9	cfe919d4-2ef2-4422-a5ca-32b1385304d9	82515df1-d04b-4e64-b1d3-91cbffa6af6c	100	100
a49184fd-21fb-4e9e-8182-9866f34addbb	6e3793e8-a7a7-48f2-8f0c-988e90fcfbc2	82515df1-d04b-4e64-b1d3-91cbffa6af6c	100	100
779eafb5-d564-4f9b-b50f-8605b5d619ec	90a7c252-c43d-4141-b1f5-3cab7a8d3c41	82515df1-d04b-4e64-b1d3-91cbffa6af6c	100	100
714af977-d1f2-4ea5-9f0b-7109f9e7abda	557f073f-c4d2-4f62-a46b-e0079ab25bcf	82515df1-d04b-4e64-b1d3-91cbffa6af6c	100	100
49d0448c-1a1c-4835-a6f6-7c2454c2fe62	6258ef8b-e231-4a5d-9a8d-ad0bd048d3aa	82515df1-d04b-4e64-b1d3-91cbffa6af6c	100	100
d1b79ef4-0f02-41a4-8fbe-ad8793345b52	cfe919d4-2ef2-4422-a5ca-32b1385304d9	6ac24df2-039d-4d24-8997-3f598f9650b1	100	100
13dcc2d0-a2bb-408e-a5e1-434c19563795	6e3793e8-a7a7-48f2-8f0c-988e90fcfbc2	6ac24df2-039d-4d24-8997-3f598f9650b1	100	100
e5659c97-db15-4c95-90e7-bed66dee9aca	90a7c252-c43d-4141-b1f5-3cab7a8d3c41	6ac24df2-039d-4d24-8997-3f598f9650b1	100	100
ab374b89-1ca7-48c0-b7f5-c07bc290865d	557f073f-c4d2-4f62-a46b-e0079ab25bcf	6ac24df2-039d-4d24-8997-3f598f9650b1	100	100
6238ff5e-9089-40f0-ba3c-a16c2c3e214f	6258ef8b-e231-4a5d-9a8d-ad0bd048d3aa	6ac24df2-039d-4d24-8997-3f598f9650b1	100	100
1c3dac42-5910-4979-a43d-8e02b8702865	cfe919d4-2ef2-4422-a5ca-32b1385304d9	182e406b-7329-49f1-9141-bcb52cbc9899	100	100
369edbb8-2b08-4f4b-8673-0cc1562b886d	6e3793e8-a7a7-48f2-8f0c-988e90fcfbc2	182e406b-7329-49f1-9141-bcb52cbc9899	100	100
d3b0416e-7f4c-4357-8194-06da82101e5b	90a7c252-c43d-4141-b1f5-3cab7a8d3c41	182e406b-7329-49f1-9141-bcb52cbc9899	100	100
4d64128e-4ba5-41b1-a1af-f64ce9ddc7a9	557f073f-c4d2-4f62-a46b-e0079ab25bcf	182e406b-7329-49f1-9141-bcb52cbc9899	100	100
01345551-1fb3-4948-b4f5-bfb9ada099ab	6258ef8b-e231-4a5d-9a8d-ad0bd048d3aa	182e406b-7329-49f1-9141-bcb52cbc9899	100	100
4ad4e07e-e83a-49dd-afdb-6f594fdb7914	cfe919d4-2ef2-4422-a5ca-32b1385304d9	aabb97a1-6f49-42df-8b61-ac867facbec1	100	100
e2833bef-62cd-4f5f-8680-44e60f775f0c	6e3793e8-a7a7-48f2-8f0c-988e90fcfbc2	aabb97a1-6f49-42df-8b61-ac867facbec1	100	100
2b9556a2-354d-4877-b031-14fc9f9096ac	90a7c252-c43d-4141-b1f5-3cab7a8d3c41	aabb97a1-6f49-42df-8b61-ac867facbec1	100	100
db1ae5f1-f48f-4842-89d7-ff33f92bdc4a	557f073f-c4d2-4f62-a46b-e0079ab25bcf	aabb97a1-6f49-42df-8b61-ac867facbec1	100	100
8964da39-3892-446d-b6a5-f55734c6cf63	6258ef8b-e231-4a5d-9a8d-ad0bd048d3aa	aabb97a1-6f49-42df-8b61-ac867facbec1	100	100
f05ac76a-0036-47a4-b669-4572954c5ee1	cfe919d4-2ef2-4422-a5ca-32b1385304d9	1cf6a236-8332-4bc1-96c0-a0b3e0b885c7	100	100
56014d72-e5c6-4c4f-af13-d2adb2d7ed2a	cfe919d4-2ef2-4422-a5ca-32b1385304d9	616236dd-7531-48c7-b03f-a278b702cce4	100	100
10a70550-a07e-42ae-b8a6-f14559e0f16c	cfe919d4-2ef2-4422-a5ca-32b1385304d9	81232615-f13e-4942-ba31-32dc1b9f9f99	100	100
26845ae1-6719-424d-be73-44f561563e39	cfe919d4-2ef2-4422-a5ca-32b1385304d9	771e2f01-3e6e-4934-b09c-47f77436ee80	100	100
b4af8373-fbf3-4329-97c5-f830a798ee61	cfe919d4-2ef2-4422-a5ca-32b1385304d9	2957c115-49a9-4629-a762-c19f2e2550bc	100	100
3e7f287e-0dcd-454a-9590-4f5c7d96196d	cfe919d4-2ef2-4422-a5ca-32b1385304d9	31b94bda-fa35-4ac1-9a82-826f785ecc1b	100	100
b448d330-b5c9-499c-a3c4-6585f1a6d541	cfe919d4-2ef2-4422-a5ca-32b1385304d9	f864aee4-4bd0-4af4-8330-dda7264434f7	100	100
2d3d11e7-7030-43be-9790-02ae09808ce4	6e3793e8-a7a7-48f2-8f0c-988e90fcfbc2	1cf6a236-8332-4bc1-96c0-a0b3e0b885c7	100	100
ee35d962-9ac8-4fa9-96e8-a6dd6540e619	6e3793e8-a7a7-48f2-8f0c-988e90fcfbc2	616236dd-7531-48c7-b03f-a278b702cce4	100	100
884262d8-8cbc-4d28-9dba-9bc9187dfbb3	6e3793e8-a7a7-48f2-8f0c-988e90fcfbc2	81232615-f13e-4942-ba31-32dc1b9f9f99	100	100
42e25565-fdab-41ec-8718-626b44adb6d5	6e3793e8-a7a7-48f2-8f0c-988e90fcfbc2	771e2f01-3e6e-4934-b09c-47f77436ee80	100	100
e4e06a35-1eea-42b7-a99a-f158307f7ee1	6e3793e8-a7a7-48f2-8f0c-988e90fcfbc2	2957c115-49a9-4629-a762-c19f2e2550bc	100	100
0442343e-74ee-4c17-a122-40c78f78cb81	6e3793e8-a7a7-48f2-8f0c-988e90fcfbc2	31b94bda-fa35-4ac1-9a82-826f785ecc1b	100	100
e66153d3-71a9-4101-bbc1-702e916a7222	6e3793e8-a7a7-48f2-8f0c-988e90fcfbc2	f864aee4-4bd0-4af4-8330-dda7264434f7	100	100
ac703780-b4e4-4a13-855c-f2af9073fbd6	90a7c252-c43d-4141-b1f5-3cab7a8d3c41	1cf6a236-8332-4bc1-96c0-a0b3e0b885c7	100	100
2ffcfce1-f3e3-4ffb-aa56-971b74b30983	90a7c252-c43d-4141-b1f5-3cab7a8d3c41	616236dd-7531-48c7-b03f-a278b702cce4	100	100
d66c8ec3-8a37-4a88-bbe5-ff5a342039a8	90a7c252-c43d-4141-b1f5-3cab7a8d3c41	81232615-f13e-4942-ba31-32dc1b9f9f99	100	100
5de81dfa-59dc-4962-9cc0-044517f16843	90a7c252-c43d-4141-b1f5-3cab7a8d3c41	771e2f01-3e6e-4934-b09c-47f77436ee80	100	100
d9803a67-3047-411b-ac8c-8b43ad723418	90a7c252-c43d-4141-b1f5-3cab7a8d3c41	2957c115-49a9-4629-a762-c19f2e2550bc	100	100
9183d792-56cf-4e0c-9769-80f9da8040e8	90a7c252-c43d-4141-b1f5-3cab7a8d3c41	31b94bda-fa35-4ac1-9a82-826f785ecc1b	100	100
3bd396da-85a5-4248-94ef-cfa467e18abf	557f073f-c4d2-4f62-a46b-e0079ab25bcf	1cf6a236-8332-4bc1-96c0-a0b3e0b885c7	100	100
a04f432e-135e-4f86-85ee-ddd5eae58f94	557f073f-c4d2-4f62-a46b-e0079ab25bcf	616236dd-7531-48c7-b03f-a278b702cce4	100	100
7979d43c-44da-4281-a4d0-c5e341c9d4ff	557f073f-c4d2-4f62-a46b-e0079ab25bcf	81232615-f13e-4942-ba31-32dc1b9f9f99	100	100
b82e22d4-7664-4b82-99ab-f0d0f630db9b	557f073f-c4d2-4f62-a46b-e0079ab25bcf	771e2f01-3e6e-4934-b09c-47f77436ee80	100	100
582ca6a3-dd2c-4aae-8ffe-0ea3508fa177	557f073f-c4d2-4f62-a46b-e0079ab25bcf	31b94bda-fa35-4ac1-9a82-826f785ecc1b	100	100
9e5ae8c9-3ac0-42e1-96e7-80c39e58a653	557f073f-c4d2-4f62-a46b-e0079ab25bcf	f864aee4-4bd0-4af4-8330-dda7264434f7	100	100
0912f9a5-bfbf-498b-90d8-c636e7bbdb07	6258ef8b-e231-4a5d-9a8d-ad0bd048d3aa	1cf6a236-8332-4bc1-96c0-a0b3e0b885c7	100	100
76067b2b-a112-44e6-95a9-120e13745214	6258ef8b-e231-4a5d-9a8d-ad0bd048d3aa	616236dd-7531-48c7-b03f-a278b702cce4	100	100
7c6afc6a-8cf0-484c-bc0c-09d00689c584	6258ef8b-e231-4a5d-9a8d-ad0bd048d3aa	81232615-f13e-4942-ba31-32dc1b9f9f99	100	100
fd7fb850-a7bd-4672-8c7d-282d4630bb97	6258ef8b-e231-4a5d-9a8d-ad0bd048d3aa	771e2f01-3e6e-4934-b09c-47f77436ee80	100	100
009756e1-22e7-470d-b5d3-a587352a16ab	6258ef8b-e231-4a5d-9a8d-ad0bd048d3aa	2957c115-49a9-4629-a762-c19f2e2550bc	100	100
67e401da-864b-489c-9bc1-f6b2d63cde5e	6258ef8b-e231-4a5d-9a8d-ad0bd048d3aa	31b94bda-fa35-4ac1-9a82-826f785ecc1b	100	100
dd0e310a-e2e6-4acf-acd6-793b81d4e37e	6258ef8b-e231-4a5d-9a8d-ad0bd048d3aa	f864aee4-4bd0-4af4-8330-dda7264434f7	100	100
25c7c7b5-f847-4276-9f05-8e661aafa299	557f073f-c4d2-4f62-a46b-e0079ab25bcf	2957c115-49a9-4629-a762-c19f2e2550bc	100	95
3a1c5f5f-b92f-4dc6-a2ef-fe39ac8619a8	90a7c252-c43d-4141-b1f5-3cab7a8d3c41	f864aee4-4bd0-4af4-8330-dda7264434f7	100	88
\.


--
-- Data for Name: Equipment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Equipment" (id, name, type) FROM stdin;
42bb9d45-7ac9-4d07-84e2-dfbc3e44704c	Tank	VEHICLE
96766a24-40bc-49eb-8dd9-7c8863dc3155	Jeep	VEHICLE
0e89739e-a6ae-44b9-b736-027412538ac0	Rifle	WEAPON
3fec0885-c1a8-48f9-ac4b-0d06c68f3c9c	Pistol	WEAPON
82515df1-d04b-4e64-b1d3-91cbffa6af6c	Bullets	AMMUNITION
6ac24df2-039d-4d24-8997-3f598f9650b1	Radio	COMMUNICATION_EQUIPMENT
182e406b-7329-49f1-9141-bcb52cbc9899	Med Kit	MEDICAL_SUPPLIES
aabb97a1-6f49-42df-8b61-ac867facbec1	Drone	OTHER
1cf6a236-8332-4bc1-96c0-a0b3e0b885c7	Tank T-90	VEHICLE
616236dd-7531-48c7-b03f-a278b702cce4	AK-47	WEAPON
81232615-f13e-4942-ba31-32dc1b9f9f99	Sniper Rifle	WEAPON
771e2f01-3e6e-4934-b09c-47f77436ee80	Radio Set	COMMUNICATION_EQUIPMENT
2957c115-49a9-4629-a762-c19f2e2550bc	First Aid Kit	MEDICAL_SUPPLIES
31b94bda-fa35-4ac1-9a82-826f785ecc1b	Ammo Box	AMMUNITION
f864aee4-4bd0-4af4-8330-dda7264434f7	Jeep	VEHICLE
\.


--
-- Data for Name: Expenditure; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Expenditure" (id, "baseId", "equipmentId", quantity, reason, "performedBy", "createdAt") FROM stdin;
5607c1a0-fa2f-4e90-97ac-be1196603240	cfe919d4-2ef2-4422-a5ca-32b1385304d9	42bb9d45-7ac9-4d07-84e2-dfbc3e44704c	3	Training exercise	26df6d65-affb-4328-95b9-b3c4428e7efc	2025-12-14 21:53:56.032
974369b0-82fb-4b14-a17d-d587eaf85a17	6e3793e8-a7a7-48f2-8f0c-988e90fcfbc2	96766a24-40bc-49eb-8dd9-7c8863dc3155	3	Training exercise	005bd574-148c-4535-9b42-2447e3969469	2025-12-14 21:53:56.036
120c166f-80f1-4d0b-8574-e5dc9403b0fd	90a7c252-c43d-4141-b1f5-3cab7a8d3c41	0e89739e-a6ae-44b9-b736-027412538ac0	3	Training exercise	a07f3f37-8279-4818-8df2-4bfff9ce0730	2025-12-14 21:53:56.038
c25699c7-290a-4342-84d6-a8d2a7bbc385	557f073f-c4d2-4f62-a46b-e0079ab25bcf	3fec0885-c1a8-48f9-ac4b-0d06c68f3c9c	3	Training exercise	7eb160c9-214d-4102-9076-c62c8e35ca85	2025-12-14 21:53:56.041
739bf723-594a-4110-be6b-fac9e318c45b	6258ef8b-e231-4a5d-9a8d-ad0bd048d3aa	82515df1-d04b-4e64-b1d3-91cbffa6af6c	3	Training exercise	1600f213-b5e8-45e4-8028-06cc900794be	2025-12-14 21:53:56.043
\.


--
-- Data for Name: Purchase; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Purchase" (id, "baseId", "createdBy", status, date) FROM stdin;
bdff71f3-cb73-478d-a46d-4fbece022240	cfe919d4-2ef2-4422-a5ca-32b1385304d9	26df6d65-affb-4328-95b9-b3c4428e7efc	RECEIVED	2025-12-14 21:53:55.908
d7b2c848-d312-4411-802f-282ebd6df543	6e3793e8-a7a7-48f2-8f0c-988e90fcfbc2	005bd574-148c-4535-9b42-2447e3969469	RECEIVED	2025-12-14 21:53:55.945
cd9ae179-29f6-44c0-aa15-f05d18d27db4	90a7c252-c43d-4141-b1f5-3cab7a8d3c41	a07f3f37-8279-4818-8df2-4bfff9ce0730	RECEIVED	2025-12-14 21:53:55.955
9d9eaa14-5ee4-427c-ae73-410ea883c278	557f073f-c4d2-4f62-a46b-e0079ab25bcf	7eb160c9-214d-4102-9076-c62c8e35ca85	RECEIVED	2025-12-14 21:53:55.964
30f52f61-0d3f-430d-99d6-aadfa8c342d8	6258ef8b-e231-4a5d-9a8d-ad0bd048d3aa	1600f213-b5e8-45e4-8028-06cc900794be	RECEIVED	2025-12-14 21:53:55.968
\.


--
-- Data for Name: PurchaseItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PurchaseItem" (id, "purchaseId", "equipmentId", quantity) FROM stdin;
e161d7fa-87b6-41b3-8960-4aaea290725f	bdff71f3-cb73-478d-a46d-4fbece022240	42bb9d45-7ac9-4d07-84e2-dfbc3e44704c	20
2cb06f16-52a5-4c3b-a2a1-da5d6d9cf8d6	bdff71f3-cb73-478d-a46d-4fbece022240	96766a24-40bc-49eb-8dd9-7c8863dc3155	20
9ec4e0f4-d48a-442c-b4fa-ddbbb8635129	bdff71f3-cb73-478d-a46d-4fbece022240	0e89739e-a6ae-44b9-b736-027412538ac0	20
1e8e9112-63aa-4279-a14a-b5428da58346	d7b2c848-d312-4411-802f-282ebd6df543	42bb9d45-7ac9-4d07-84e2-dfbc3e44704c	20
50158828-105b-49af-a6ed-485ed4211bd5	d7b2c848-d312-4411-802f-282ebd6df543	96766a24-40bc-49eb-8dd9-7c8863dc3155	20
cf146878-eeba-4a57-80fa-fa00708100c5	d7b2c848-d312-4411-802f-282ebd6df543	0e89739e-a6ae-44b9-b736-027412538ac0	20
88683fda-61c0-405b-aed3-017dc02aa806	cd9ae179-29f6-44c0-aa15-f05d18d27db4	42bb9d45-7ac9-4d07-84e2-dfbc3e44704c	20
d4a44a73-f9e6-4ab9-8c06-aba443cc0728	cd9ae179-29f6-44c0-aa15-f05d18d27db4	96766a24-40bc-49eb-8dd9-7c8863dc3155	20
8a465dcb-60bd-4c8c-92b0-9cd650e46c0e	cd9ae179-29f6-44c0-aa15-f05d18d27db4	0e89739e-a6ae-44b9-b736-027412538ac0	20
5ecf6581-19be-439e-8663-9850e53482d4	9d9eaa14-5ee4-427c-ae73-410ea883c278	42bb9d45-7ac9-4d07-84e2-dfbc3e44704c	20
3574b0b8-be80-4d96-a9b2-cc61487be83e	9d9eaa14-5ee4-427c-ae73-410ea883c278	96766a24-40bc-49eb-8dd9-7c8863dc3155	20
19a708a7-7cd1-4bd2-96ad-3dfccf82a688	9d9eaa14-5ee4-427c-ae73-410ea883c278	0e89739e-a6ae-44b9-b736-027412538ac0	20
051f5ff2-f265-47c2-b973-7235abd547fc	30f52f61-0d3f-430d-99d6-aadfa8c342d8	42bb9d45-7ac9-4d07-84e2-dfbc3e44704c	20
aa6df45d-40ae-4013-ad15-fad4d79d61bf	30f52f61-0d3f-430d-99d6-aadfa8c342d8	96766a24-40bc-49eb-8dd9-7c8863dc3155	20
8e0d5e01-b4cf-46a1-bc53-37a39afa12c0	30f52f61-0d3f-430d-99d6-aadfa8c342d8	0e89739e-a6ae-44b9-b736-027412538ac0	20
\.


--
-- Data for Name: Transaction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Transaction" (id, "txType", "baseId", "equipmentId", quantity, "sourceType", "sourceId", "performedBy", "createdAt") FROM stdin;
beac84ca-f85e-458d-8ffb-84d77ac1fef0	PURCHASE	cfe919d4-2ef2-4422-a5ca-32b1385304d9	42bb9d45-7ac9-4d07-84e2-dfbc3e44704c	10	PURCHASE	SEED	26df6d65-affb-4328-95b9-b3c4428e7efc	2025-12-14 21:53:56.045
2cc2e054-9b30-414c-9e17-17e6e03be21d	PURCHASE	6e3793e8-a7a7-48f2-8f0c-988e90fcfbc2	96766a24-40bc-49eb-8dd9-7c8863dc3155	10	PURCHASE	SEED	005bd574-148c-4535-9b42-2447e3969469	2025-12-14 21:53:56.055
6e8ce042-fbb3-467c-8e51-78547dcffa1f	PURCHASE	90a7c252-c43d-4141-b1f5-3cab7a8d3c41	0e89739e-a6ae-44b9-b736-027412538ac0	10	PURCHASE	SEED	a07f3f37-8279-4818-8df2-4bfff9ce0730	2025-12-14 21:53:56.063
6277e5fb-fcb6-42a5-a1df-a39d9809f75a	PURCHASE	557f073f-c4d2-4f62-a46b-e0079ab25bcf	3fec0885-c1a8-48f9-ac4b-0d06c68f3c9c	10	PURCHASE	SEED	7eb160c9-214d-4102-9076-c62c8e35ca85	2025-12-14 21:53:56.071
02741adc-879e-46dd-8315-49d885a0524d	PURCHASE	6258ef8b-e231-4a5d-9a8d-ad0bd048d3aa	82515df1-d04b-4e64-b1d3-91cbffa6af6c	10	PURCHASE	SEED	1600f213-b5e8-45e4-8028-06cc900794be	2025-12-14 21:53:56.079
65e0c538-e712-4139-864e-e5040a52f44a	PURCHASE	cfe919d4-2ef2-4422-a5ca-32b1385304d9	6ac24df2-039d-4d24-8997-3f598f9650b1	10	PURCHASE	SEED	15d39687-1788-4940-8ef7-06da78e3d2fe	2025-12-14 21:53:56.087
b6258794-7029-4324-a9c1-9963182befa6	PURCHASE	6e3793e8-a7a7-48f2-8f0c-988e90fcfbc2	182e406b-7329-49f1-9141-bcb52cbc9899	10	PURCHASE	SEED	fbc87c1b-c2fb-4e8f-a919-123568f94a7b	2025-12-14 21:53:56.09
9b9d2e64-f6d7-4667-8854-ef1097d1491d	PURCHASE	90a7c252-c43d-4141-b1f5-3cab7a8d3c41	aabb97a1-6f49-42df-8b61-ac867facbec1	10	PURCHASE	SEED	67009304-2836-4ff3-8417-03ebdd44e76b	2025-12-14 21:53:56.092
f1cd3923-6d67-4eae-8b41-215ffc6d1ea9	PURCHASE	557f073f-c4d2-4f62-a46b-e0079ab25bcf	1cf6a236-8332-4bc1-96c0-a0b3e0b885c7	10	PURCHASE	SEED	ad146adf-f23c-43b0-b430-dbd142bb5325	2025-12-14 21:53:56.094
bc579a5b-1d8b-46bb-844a-df8884bb1713	PURCHASE	6258ef8b-e231-4a5d-9a8d-ad0bd048d3aa	616236dd-7531-48c7-b03f-a278b702cce4	10	PURCHASE	SEED	e9beda9e-c55a-4593-b273-90598689b450	2025-12-14 21:53:56.096
\.


--
-- Data for Name: Transfer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Transfer" (id, "fromBaseId", "toBaseId", "createdBy", status, date) FROM stdin;
b5267519-7ee2-4bdb-b1fd-17eaff49f1bd	cfe919d4-2ef2-4422-a5ca-32b1385304d9	6e3793e8-a7a7-48f2-8f0c-988e90fcfbc2	26df6d65-affb-4328-95b9-b3c4428e7efc	COMPLETED	2025-12-14 21:53:55.973
f825dd80-d138-42c7-b4ce-91dc873ee552	6e3793e8-a7a7-48f2-8f0c-988e90fcfbc2	90a7c252-c43d-4141-b1f5-3cab7a8d3c41	005bd574-148c-4535-9b42-2447e3969469	COMPLETED	2025-12-14 21:53:55.98
12354429-9802-460f-8d63-bfb50eb3659e	90a7c252-c43d-4141-b1f5-3cab7a8d3c41	557f073f-c4d2-4f62-a46b-e0079ab25bcf	a07f3f37-8279-4818-8df2-4bfff9ce0730	COMPLETED	2025-12-14 21:53:55.983
6567dfca-d1d0-49da-94e4-1e30e31c8ec7	557f073f-c4d2-4f62-a46b-e0079ab25bcf	6258ef8b-e231-4a5d-9a8d-ad0bd048d3aa	7eb160c9-214d-4102-9076-c62c8e35ca85	COMPLETED	2025-12-14 21:53:55.988
d7764769-6f78-4ab9-ac6c-c1cd0080daa1	6258ef8b-e231-4a5d-9a8d-ad0bd048d3aa	cfe919d4-2ef2-4422-a5ca-32b1385304d9	1600f213-b5e8-45e4-8028-06cc900794be	COMPLETED	2025-12-14 21:53:55.993
\.


--
-- Data for Name: TransferItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TransferItem" (id, "transferId", "equipmentId", quantity) FROM stdin;
fd42e565-aee7-4870-94fd-8810ea2a8f35	b5267519-7ee2-4bdb-b1fd-17eaff49f1bd	42bb9d45-7ac9-4d07-84e2-dfbc3e44704c	10
a2a4d24a-5620-4881-bcac-a6b6bfab71f5	b5267519-7ee2-4bdb-b1fd-17eaff49f1bd	96766a24-40bc-49eb-8dd9-7c8863dc3155	10
704d73b9-8970-4aaa-a4fd-9e41e7ad2b5c	f825dd80-d138-42c7-b4ce-91dc873ee552	42bb9d45-7ac9-4d07-84e2-dfbc3e44704c	10
9ae2acdd-f432-4acd-8426-eaaf2b33a397	f825dd80-d138-42c7-b4ce-91dc873ee552	96766a24-40bc-49eb-8dd9-7c8863dc3155	10
281abb9e-1ed9-45a2-9bb2-c8e34f373f92	12354429-9802-460f-8d63-bfb50eb3659e	42bb9d45-7ac9-4d07-84e2-dfbc3e44704c	10
f7549fed-2244-4ac3-a438-4d03f78130c6	12354429-9802-460f-8d63-bfb50eb3659e	96766a24-40bc-49eb-8dd9-7c8863dc3155	10
04e56b68-ffcc-4aec-9d55-9b7be650a1e3	6567dfca-d1d0-49da-94e4-1e30e31c8ec7	42bb9d45-7ac9-4d07-84e2-dfbc3e44704c	10
c303e823-af7b-4a4f-9940-ed637e90ffdb	6567dfca-d1d0-49da-94e4-1e30e31c8ec7	96766a24-40bc-49eb-8dd9-7c8863dc3155	10
93fd5f4d-fbef-43fb-ae9e-a424e0b51986	d7764769-6f78-4ab9-ac6c-c1cd0080daa1	42bb9d45-7ac9-4d07-84e2-dfbc3e44704c	10
993d75f5-3595-495c-bf41-b92da699c571	d7764769-6f78-4ab9-ac6c-c1cd0080daa1	96766a24-40bc-49eb-8dd9-7c8863dc3155	10
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, name, email, "hashedPassword", role, "baseId", "createdAt") FROM stdin;
26df6d65-affb-4328-95b9-b3c4428e7efc	Admin 0	admin0@army.com	hashed_pw	ADMIN	cfe919d4-2ef2-4422-a5ca-32b1385304d9	2025-12-14 21:53:55.137
005bd574-148c-4535-9b42-2447e3969469	Logistics 0	logistics0@army.com	hashed_pw	LOGISTICS_PERSONNEL	cfe919d4-2ef2-4422-a5ca-32b1385304d9	2025-12-14 21:53:55.137
a07f3f37-8279-4818-8df2-4bfff9ce0730	Admin 1	admin1@army.com	hashed_pw	ADMIN	6e3793e8-a7a7-48f2-8f0c-988e90fcfbc2	2025-12-14 21:53:55.137
7eb160c9-214d-4102-9076-c62c8e35ca85	Logistics 1	logistics1@army.com	hashed_pw	LOGISTICS_PERSONNEL	6e3793e8-a7a7-48f2-8f0c-988e90fcfbc2	2025-12-14 21:53:55.137
1600f213-b5e8-45e4-8028-06cc900794be	Admin 2	admin2@army.com	hashed_pw	ADMIN	90a7c252-c43d-4141-b1f5-3cab7a8d3c41	2025-12-14 21:53:55.137
15d39687-1788-4940-8ef7-06da78e3d2fe	Logistics 2	logistics2@army.com	hashed_pw	LOGISTICS_PERSONNEL	90a7c252-c43d-4141-b1f5-3cab7a8d3c41	2025-12-14 21:53:55.137
fbc87c1b-c2fb-4e8f-a919-123568f94a7b	Admin 3	admin3@army.com	hashed_pw	ADMIN	557f073f-c4d2-4f62-a46b-e0079ab25bcf	2025-12-14 21:53:55.137
67009304-2836-4ff3-8417-03ebdd44e76b	Logistics 3	logistics3@army.com	hashed_pw	LOGISTICS_PERSONNEL	557f073f-c4d2-4f62-a46b-e0079ab25bcf	2025-12-14 21:53:55.137
ad146adf-f23c-43b0-b430-dbd142bb5325	Admin 4	admin4@army.com	hashed_pw	ADMIN	6258ef8b-e231-4a5d-9a8d-ad0bd048d3aa	2025-12-14 21:53:55.137
e9beda9e-c55a-4593-b273-90598689b450	Logistics 4	logistics4@army.com	hashed_pw	LOGISTICS_PERSONNEL	6258ef8b-e231-4a5d-9a8d-ad0bd048d3aa	2025-12-14 21:53:55.137
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
94739154-4011-44ed-82f4-7dcb601e1933	369df356dead8c97b8e37442951dc1c5c72491a72a90358c962ac87f4c7263f1	2025-12-13 11:24:14.185534+00	20251213112413_init	\N	\N	2025-12-13 11:24:13.888355+00	1
\.


--
-- Name: Assignment Assignment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Assignment"
    ADD CONSTRAINT "Assignment_pkey" PRIMARY KEY (id);


--
-- Name: AuditLog AuditLog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_pkey" PRIMARY KEY (id);


--
-- Name: BaseStock BaseStock_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BaseStock"
    ADD CONSTRAINT "BaseStock_pkey" PRIMARY KEY (id);


--
-- Name: Base Base_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Base"
    ADD CONSTRAINT "Base_pkey" PRIMARY KEY (id);


--
-- Name: Equipment Equipment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Equipment"
    ADD CONSTRAINT "Equipment_pkey" PRIMARY KEY (id);


--
-- Name: Expenditure Expenditure_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Expenditure"
    ADD CONSTRAINT "Expenditure_pkey" PRIMARY KEY (id);


--
-- Name: PurchaseItem PurchaseItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseItem"
    ADD CONSTRAINT "PurchaseItem_pkey" PRIMARY KEY (id);


--
-- Name: Purchase Purchase_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Purchase"
    ADD CONSTRAINT "Purchase_pkey" PRIMARY KEY (id);


--
-- Name: Transaction Transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY (id);


--
-- Name: TransferItem TransferItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TransferItem"
    ADD CONSTRAINT "TransferItem_pkey" PRIMARY KEY (id);


--
-- Name: Transfer Transfer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transfer"
    ADD CONSTRAINT "Transfer_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Assignment_equipmentId_userId_dateAssigned_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Assignment_equipmentId_userId_dateAssigned_key" ON public."Assignment" USING btree ("equipmentId", "userId", "dateAssigned");


--
-- Name: BaseStock_baseId_equipmentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "BaseStock_baseId_equipmentId_key" ON public."BaseStock" USING btree ("baseId", "equipmentId");


--
-- Name: Base_baseCode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Base_baseCode_key" ON public."Base" USING btree ("baseCode");


--
-- Name: PurchaseItem_purchaseId_equipmentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PurchaseItem_purchaseId_equipmentId_key" ON public."PurchaseItem" USING btree ("purchaseId", "equipmentId");


--
-- Name: Transaction_sourceType_sourceId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Transaction_sourceType_sourceId_idx" ON public."Transaction" USING btree ("sourceType", "sourceId");


--
-- Name: TransferItem_transferId_equipmentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "TransferItem_transferId_equipmentId_key" ON public."TransferItem" USING btree ("transferId", "equipmentId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Assignment Assignment_baseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Assignment"
    ADD CONSTRAINT "Assignment_baseId_fkey" FOREIGN KEY ("baseId") REFERENCES public."Base"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Assignment Assignment_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Assignment"
    ADD CONSTRAINT "Assignment_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Assignment Assignment_equipmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Assignment"
    ADD CONSTRAINT "Assignment_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES public."Equipment"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Assignment Assignment_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Assignment"
    ADD CONSTRAINT "Assignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AuditLog AuditLog_actorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: BaseStock BaseStock_baseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BaseStock"
    ADD CONSTRAINT "BaseStock_baseId_fkey" FOREIGN KEY ("baseId") REFERENCES public."Base"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: BaseStock BaseStock_equipmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BaseStock"
    ADD CONSTRAINT "BaseStock_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES public."Equipment"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Expenditure Expenditure_baseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Expenditure"
    ADD CONSTRAINT "Expenditure_baseId_fkey" FOREIGN KEY ("baseId") REFERENCES public."Base"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Expenditure Expenditure_equipmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Expenditure"
    ADD CONSTRAINT "Expenditure_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES public."Equipment"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Expenditure Expenditure_performedBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Expenditure"
    ADD CONSTRAINT "Expenditure_performedBy_fkey" FOREIGN KEY ("performedBy") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PurchaseItem PurchaseItem_equipmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseItem"
    ADD CONSTRAINT "PurchaseItem_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES public."Equipment"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PurchaseItem PurchaseItem_purchaseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseItem"
    ADD CONSTRAINT "PurchaseItem_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES public."Purchase"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Purchase Purchase_baseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Purchase"
    ADD CONSTRAINT "Purchase_baseId_fkey" FOREIGN KEY ("baseId") REFERENCES public."Base"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Purchase Purchase_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Purchase"
    ADD CONSTRAINT "Purchase_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Transaction Transaction_baseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_baseId_fkey" FOREIGN KEY ("baseId") REFERENCES public."Base"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Transaction Transaction_equipmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES public."Equipment"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Transaction Transaction_performedBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_performedBy_fkey" FOREIGN KEY ("performedBy") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: TransferItem TransferItem_equipmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TransferItem"
    ADD CONSTRAINT "TransferItem_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES public."Equipment"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TransferItem TransferItem_transferId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TransferItem"
    ADD CONSTRAINT "TransferItem_transferId_fkey" FOREIGN KEY ("transferId") REFERENCES public."Transfer"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Transfer Transfer_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transfer"
    ADD CONSTRAINT "Transfer_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Transfer Transfer_fromBaseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transfer"
    ADD CONSTRAINT "Transfer_fromBaseId_fkey" FOREIGN KEY ("fromBaseId") REFERENCES public."Base"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Transfer Transfer_toBaseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transfer"
    ADD CONSTRAINT "Transfer_toBaseId_fkey" FOREIGN KEY ("toBaseId") REFERENCES public."Base"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: User User_baseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_baseId_fkey" FOREIGN KEY ("baseId") REFERENCES public."Base"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict nTCc2Q2kn7Ra4Oowttch4uF9rOY0MQGJnFE0UyeqbbYE7hVsfSW9Lr5pOTWPiMH

