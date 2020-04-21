create table "user"
(
	id serial not null
		constraint user_pkey
			primary key,
	email text not null,
	firstname text not null,
	lastname text not null,
	terms_accepted boolean default false not null,
	onboarded boolean default false not null,
	email_notification text default 'weekly'::text not null,
	decleration_given boolean default false not null,
	result_notification boolean default true not null,
	supports_candidate_id integer,
	onboarded_projects boolean default false not null,
	onboarded_candidates boolean default false not null,
	onboarded_proposals boolean default false not null,
	onboarded_insights boolean default false not null
);

create unique index user_id_uindex
	on "user" (id);

create unique index user_email_uindex
	on "user" (email);

create table vote
(
	user_id integer not null
		constraint vote_user_id_fk
			references "user",
	proposal_id integer not null,
	modifiedon timestamp default now() not null,
	result boolean,
	constraint vote_pk
		primary key (user_id, proposal_id)
);

create table category
(
	id serial not null
		constraint category_pkey
			primary key,
	title text not null,
	description text not null,
	feathericon text not null,
	workload integer
);

create unique index category_id_uindex
	on category (id);

create table category_preferences
(
	id serial not null
		constraint category_preferences_pkey
			primary key,
	user_id integer not null
		constraint category_preferences_user_fk
			references "user",
	category_id integer not null
		constraint category_preferences_category_fk
			references category,
	preference boolean default false not null
);

create unique index category_preferences_id_uindex
	on category_preferences (id);

create index category_preferences_user_index
	on category_preferences (user_id, category_id);

create table proposal_subscription
(
	proposal_id integer not null,
	user_id integer not null
		constraint proposal_subscribe_user_id_fk
			references "user",
	subscription boolean not null,
	constraint proposal_subscribe_user_id_proposal_id_pk
		primary key (user_id, proposal_id)
);

create table proposal
(
	id integer default '-1'::integer not null
		constraint proposal_id_pk
			primary key,
	data json,
	createdon timestamp default now() not null,
	state text
);

create unique index proposal_id_uindex
	on proposal (id);

create table category_map
(
	ft_committee_id integer not null
		constraint category_map_pkey
			primary key,
	category_id integer not null
		constraint category_map_category_id_fk
			references category,
	ft_period_id integer not null
);

create unique index category_map_ft_committee_id_uindex
	on category_map (ft_committee_id);

create table proposal_notification
(
	proposal_id integer not null,
	user_id integer not null
		constraint proposal_notification_user_id_fk
			references "user",
	type text not null,
	constraint proposal_notification_proposal_user_type
		unique (proposal_id, user_id, type)
);

create table project
(
	id serial not null
		constraint project_pkey
			primary key,
	initiator_id integer not null
		constraint project_user_id_fk
			references "user",
	category_id integer
		constraint project_category_id_fk
			references category,
	initiator_bio text,
	title text,
	description text,
	budget text,
	argument text,
	risk text,
	modifiedon timestamp default now() not null,
	createdon timestamp default now() not null,
	version integer default 1 not null,
	published boolean default false not null
);

create unique index project_history_id_uindex
	on project (id);

create unique index project_id_uindex
	on project (id);

create table project_history
(
	id serial not null
		constraint project_history_pkey
			primary key,
	project_id integer not null
		constraint project_history_project_id_fk
			references project,
	version integer not null,
	modifiedon timestamp default now() not null,
	category_id integer
		constraint project_history_category_id_fk
			references category,
	initiator_bio text,
	title text,
	description text,
	budget text,
	argument text,
	risk text,
	published boolean default false not null
);

create unique index project_id_version_uindex
	on project_history (project_id, version);

create table project_support
(
	user_id integer not null
		constraint project_support_user_id_fk
			references "user",
	project_id integer not null
		constraint project_support_project_id_fk
			references project,
	modifiedon timestamp default now() not null,
	support boolean not null,
	constraint project_support_pk
		primary key (user_id, project_id)
);

create table constituency
(
	id serial not null
		constraint constituency_pkey
			primary key,
	constituency text not null
);

create unique index constituency_id_uindex
	on constituency (id);

create table candidate
(
	user_id integer not null
		constraint candidate_pkey
			primary key
		constraint candidate_user_id_fk
			references "user",
	constituency_id integer
		constraint candidate_constituency_id_fk
			references constituency,
	phone text,
	picture text,
	facebook text,
	twitter text,
	linkedin text,
	youtube text,
	story text,
	motivation text,
	threat text,
	active boolean default false not null,
	experience text,
	terms_accepted boolean default false not null
);

alter table "user"
	add constraint user_candidate_user_id_fk
		foreign key (supports_candidate_id) references candidate;

create unique index candidate_user_id_uindex
	on candidate (user_id);

create table candidate_commitment
(
	candidate_id integer not null
		constraint candidate_commitment_candidate_user_id_fk
			references candidate,
	category_id integer
		constraint candidate_commitment_category_id_fk
			references category,
	commitment text,
	priority integer not null
		constraint candidate_commitment_priority_check
			check ((priority >= 1) AND (priority <= 3)),
	constraint candidate_commitment_candidate_id_priority_pk
		primary key (candidate_id, priority),
	constraint candidate_commitment_candidate_id_category_id_priority_pk
		unique (candidate_id, category_id, priority),
	constraint candidate_commitment_candidate_id_category_id_pk
		unique (candidate_id, category_id)
);

-- data for category
INSERT INTO public.category (id, title, description, feathericon, workload) VALUES (16, 'Social-, indenrigs- & børnepolitik', 'Sociale forhold som hjælp og støtte til personer med nedsat funktionsevne og til udsatte børn, unge og voksne samt familieret. Kommunal udligning, kommuners og regioners opgaver, valglovgivning og digitalisering af den offentlige sektor.', 'Heart', 38);
INSERT INTO public.category (id, title, description, feathericon, workload) VALUES (15, 'Skat', 'Skattepolitiske og afgiftspolitiske spørgsmål herunder told.', 'Percent', 42);
INSERT INTO public.category (id, title, description, feathericon, workload) VALUES (18, 'Transport, bygninger & boliger', 'Al infrastruktur til transport på land, til søs og i luften, samt postvæsen, byggeri og boliger.', 'Anchor', 26);
INSERT INTO public.category (id, title, description, feathericon, workload) VALUES (5, 'Finanserne', 'Finanslovsforslag, bevillinger, statslån, og generel økonomisk politik.', 'Briefcase', 15);
INSERT INTO public.category (id, title, description, feathericon, workload) VALUES (6, 'Forsvaret', 'Forsvarets organisering og deltagelse i internationale militære missioner.', 'Shield', 9);
INSERT INTO public.category (id, title, description, feathericon, workload) VALUES (22, 'Undervisning', 'Unges uddannelse og vilkår på grundskoler og ungdomsuddannelser.', 'Home', 20);
INSERT INTO public.category (id, title, description, feathericon, workload) VALUES (8, 'Folketinget', 'Grundloven, ministeransvar samt Folketingets forretningsorden, budget og administration.', 'Command', 6);
INSERT INTO public.category (id, title, description, feathericon, workload) VALUES (4, 'EU', 'EU (Den Europæiske Union) og i nogen grad WTO (Verdenshandelsorganisationen).', 'Flag', 10);
INSERT INTO public.category (id, title, description, feathericon, workload) VALUES (1, 'Beskæftigelse', 'Arbejdsmarkedspolitik og ydelser til personer uden for arbejdsmarkedet.', 'Users', 19);
INSERT INTO public.category (id, title, description, feathericon, workload) VALUES (20, 'Udenrigspolitik', 'Holdning til og involvering i begivenheder i verden, herunder udenrigs-, sikkerheds, og udviklingspolitik.', 'Globe', 6);
INSERT INTO public.category (id, title, description, feathericon, workload) VALUES (9, 'Indfødsret', 'Statsborgerskab i Danmark, samt regler for at opnå eller miste sit statsborgerskab.', 'Award', 7);
INSERT INTO public.category (id, title, description, feathericon, workload) VALUES (3, 'Erhverv, vækst & eksport', 'Alt fra handel og håndværk til valutalovgivning og patenter.', 'TrendingUp', 21);
INSERT INTO public.category (id, title, description, feathericon, workload) VALUES (12, 'Miljø & fødevarer', 'Miljøbeskyttelse, genteknologi, fødevarer og kostvaner.', 'Sun', 21);
INSERT INTO public.category (id, title, description, feathericon, workload) VALUES (21, 'Udlændinge & integration', 'Asyl- og flygtningepolitik, udlændinge og integration.', 'LifeBuoy', 41);
INSERT INTO public.category (id, title, description, feathericon, workload) VALUES (11, 'Ligestilling', 'Ligestillingsforhold, herunder nationalt og internationalt ligestillingsarbejde.', 'Minimize2', 10);
INSERT INTO public.category (id, title, description, feathericon, workload) VALUES (13, 'Religion', 'Folkekirken, andre trossamfund og begravelsesvæsenet.', 'Bell', 2);
INSERT INTO public.category (id, title, description, feathericon, workload) VALUES (7, 'Landdistrikter', 'Landdistrikterne, Grønland, Færøerne og de mindre øers vilkår og udvikling.', 'Map', 10);
INSERT INTO public.category (id, title, description, feathericon, workload) VALUES (10, 'Kultur', 'Biblioteker, museer, kunst og folkeoplysning.', 'Image', 4);
INSERT INTO public.category (id, title, description, feathericon, workload) VALUES (14, 'Retssystemet', 'Rets- og politivæsen, f.eks. straffelovgivning, retsplejeloven, formueret, tinglysning m.v.', 'BookOpen', 38);
INSERT INTO public.category (id, title, description, feathericon, workload) VALUES (17, 'Sundhed & ældre', 'Sundheds- og ældrepolitiske spørgsmål, herunder sygdomme og forbyggelse.', 'Thermometer', 27);
INSERT INTO public.category (id, title, description, feathericon, workload) VALUES (19, 'Uddannelse & forskning', 'Videregående uddannelser, forskning og uddannelsesstøtte.', 'FileText', 11);
INSERT INTO public.category (id, title, description, feathericon, workload) VALUES (2, 'Klima, energi & forsyning', 'Udvinding, produktion, forsyning og forbrug af energi og dets indflydelse på klimaet.', 'Zap', 12);

-- data for mapping category to ft
INSERT INTO public.category_map (ft_committee_id, category_id, ft_period_id) VALUES (18860, 1, 151);
INSERT INTO public.category_map (ft_committee_id, category_id, ft_period_id) VALUES (18874, 2, 151);
INSERT INTO public.category_map (ft_committee_id, category_id, ft_period_id) VALUES (18871, 3, 151);
INSERT INTO public.category_map (ft_committee_id, category_id, ft_period_id) VALUES (18922, 4, 151);
INSERT INTO public.category_map (ft_committee_id, category_id, ft_period_id) VALUES (18919, 4, 151);
INSERT INTO public.category_map (ft_committee_id, category_id, ft_period_id) VALUES (18863, 5, 151);
INSERT INTO public.category_map (ft_committee_id, category_id, ft_period_id) VALUES (18872, 6, 151);
INSERT INTO public.category_map (ft_committee_id, category_id, ft_period_id) VALUES (18948, 7, 151);
INSERT INTO public.category_map (ft_committee_id, category_id, ft_period_id) VALUES (18865, 7, 151);
INSERT INTO public.category_map (ft_committee_id, category_id, ft_period_id) VALUES (18881, 7, 151);
INSERT INTO public.category_map (ft_committee_id, category_id, ft_period_id) VALUES (18864, 7, 151);
INSERT INTO public.category_map (ft_committee_id, category_id, ft_period_id) VALUES (18935, 8, 151);
INSERT INTO public.category_map (ft_committee_id, category_id, ft_period_id) VALUES (18868, 8, 151);
INSERT INTO public.category_map (ft_committee_id, category_id, ft_period_id) VALUES (18901, 8, 151);
INSERT INTO public.category_map (ft_committee_id, category_id, ft_period_id) VALUES (18902, 8, 151);
INSERT INTO public.category_map (ft_committee_id, category_id, ft_period_id) VALUES (18903, 8, 151);
INSERT INTO public.category_map (ft_committee_id, category_id, ft_period_id) VALUES (18904, 8, 151);
INSERT INTO public.category_map (ft_committee_id, category_id, ft_period_id) VALUES (18905, 8, 151);
INSERT INTO public.category_map (ft_committee_id, category_id, ft_period_id) VALUES (18873, 9, 151);
INSERT INTO public.category_map (ft_committee_id, category_id, ft_period_id) VALUES (18867, 10, 151);
INSERT INTO public.category_map (ft_committee_id, category_id, ft_period_id) VALUES (18875, 11, 151);
INSERT INTO public.category_map (ft_committee_id, category_id, ft_period_id) VALUES (18932, 12, 151);
INSERT INTO public.category_map (ft_committee_id, category_id, ft_period_id) VALUES (18866, 13, 151);
INSERT INTO public.category_map (ft_committee_id, category_id, ft_period_id) VALUES (18869, 14, 151);
INSERT INTO public.category_map (ft_committee_id, category_id, ft_period_id) VALUES (18876, 15, 151);
INSERT INTO public.category_map (ft_committee_id, category_id, ft_period_id) VALUES (18877, 16, 151);
INSERT INTO public.category_map (ft_committee_id, category_id, ft_period_id) VALUES (18921, 17, 151);
INSERT INTO public.category_map (ft_committee_id, category_id, ft_period_id) VALUES (18884, 18, 151);
INSERT INTO public.category_map (ft_committee_id, category_id, ft_period_id) VALUES (18878, 18, 151);
INSERT INTO public.category_map (ft_committee_id, category_id, ft_period_id) VALUES (18870, 19, 151);
INSERT INTO public.category_map (ft_committee_id, category_id, ft_period_id) VALUES (18879, 20, 151);
INSERT INTO public.category_map (ft_committee_id, category_id, ft_period_id) VALUES (18926, 20, 151);
INSERT INTO public.category_map (ft_committee_id, category_id, ft_period_id) VALUES (18929, 20, 151);
INSERT INTO public.category_map (ft_committee_id, category_id, ft_period_id) VALUES (18880, 21, 151);
INSERT INTO public.category_map (ft_committee_id, category_id, ft_period_id) VALUES (18861, 22, 151);

-- data for constituency
INSERT INTO public.constituency (id, constituency) VALUES (1, 'København');
INSERT INTO public.constituency (id, constituency) VALUES (2, 'Nordjylland');
INSERT INTO public.constituency (id, constituency) VALUES (3, 'Vestjylland');
INSERT INTO public.constituency (id, constituency) VALUES (4, 'Nordsjælland');
INSERT INTO public.constituency (id, constituency) VALUES (5, 'Sjælland');
INSERT INTO public.constituency (id, constituency) VALUES (6, 'Sydjylland');
INSERT INTO public.constituency (id, constituency) VALUES (7, 'Københavns Omegn');
INSERT INTO public.constituency (id, constituency) VALUES (8, 'Fyn');
INSERT INTO public.constituency (id, constituency) VALUES (9, 'Bornholm');
INSERT INTO public.constituency (id, constituency) VALUES (10, 'Østjylland');
INSERT INTO public.constituency (id, constituency) VALUES (11, 'København');
INSERT INTO public.constituency (id, constituency) VALUES (12, 'Nordjylland');
INSERT INTO public.constituency (id, constituency) VALUES (13, 'Vestjylland');
INSERT INTO public.constituency (id, constituency) VALUES (14, 'Nordsjælland');
INSERT INTO public.constituency (id, constituency) VALUES (15, 'Sjælland');
INSERT INTO public.constituency (id, constituency) VALUES (16, 'Sydjylland');
INSERT INTO public.constituency (id, constituency) VALUES (17, 'Københavns Omegn');
INSERT INTO public.constituency (id, constituency) VALUES (18, 'Fyn');
INSERT INTO public.constituency (id, constituency) VALUES (19, 'Bornholm');
INSERT INTO public.constituency (id, constituency) VALUES (20, 'Østjylland');

-- to get data for proposals run batch job from server
