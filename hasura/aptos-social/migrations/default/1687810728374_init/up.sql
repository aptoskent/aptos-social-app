SET check_function_bodies = false;
CREATE FUNCTION public.is_test_user(user_phone_number text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM test_user_phone_number WHERE phone_number = user_phone_number);
END;
$$;
CREATE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$;
CREATE TABLE public.comment (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    post_id uuid NOT NULL,
    from_user_id uuid NOT NULL
);
CREATE TABLE public."group" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    is_private boolean DEFAULT true NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    points integer DEFAULT 0 NOT NULL,
    profile_picture_img_id uuid,
    created_by_user_id uuid NOT NULL,
    group_size integer DEFAULT 0 NOT NULL,
    profile_picture_serial_number integer,
    is_deleted boolean DEFAULT false NOT NULL,
    is_test_group boolean DEFAULT false NOT NULL,
    test_group_profile_picture_serial_number integer
);
CREATE TABLE public.group_join_request (
    group_id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    id integer NOT NULL
);
CREATE SEQUENCE public.group_join_request_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.group_join_request_id_seq OWNED BY public.group_join_request.id;
CREATE TABLE public.image (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    img_url text NOT NULL,
    thumbnail_url text,
    original_img_url text,
    created_by_user_id uuid,
    metadata jsonb NOT NULL
);
CREATE TABLE public.mascot_image_reusable (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    serial_number integer NOT NULL,
    img_url text NOT NULL,
    background_colors jsonb DEFAULT jsonb_build_object(),
    updated_at timestamp with time zone DEFAULT now()
);
COMMENT ON TABLE public.mascot_image_reusable IS 'Reusable mascot images for test groups.';
CREATE SEQUENCE public.mascot_image_reusable_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.mascot_image_reusable_id_seq OWNED BY public.mascot_image_reusable.id;
CREATE SEQUENCE public.mascot_image_reusable_serial_number_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.mascot_image_reusable_serial_number_seq OWNED BY public.mascot_image_reusable.serial_number;
CREATE TABLE public.mascot_image_unused (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    img_url text NOT NULL,
    serial_number integer DEFAULT 0 NOT NULL,
    background_colors jsonb DEFAULT jsonb_build_object()
);
CREATE SEQUENCE public.mascot_image_unused_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.mascot_image_unused_id_seq OWNED BY public.mascot_image_unused.id;
CREATE TABLE public.mascot_image_used (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    img_url text NOT NULL,
    serial_number integer DEFAULT 0 NOT NULL,
    background_colors jsonb DEFAULT jsonb_build_object()
);
CREATE SEQUENCE public.mascot_image_used_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.mascot_image_used_id_seq OWNED BY public.mascot_image_used.id;
CREATE TABLE public.photo_post (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    caption text,
    created_by_user_id uuid NOT NULL,
    image_id uuid NOT NULL
);
CREATE TABLE public.post (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    type text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    points_gained integer DEFAULT 0,
    group_id uuid NOT NULL,
    photo_post_id uuid NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    updated_at timestamp with time zone DEFAULT now(),
    is_hidden boolean DEFAULT false,
    is_hidden_in_discover boolean DEFAULT false
);
CREATE TABLE public.post_type_enum (
    type text NOT NULL
);
CREATE TABLE public.pronoun_type_enum (
    pronoun text NOT NULL,
    value text NOT NULL
);
CREATE TABLE public.push_token (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid NOT NULL,
    device_id text NOT NULL,
    push_token text NOT NULL,
    is_active boolean NOT NULL
);
CREATE TABLE public.reaction (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    type text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    post_id uuid NOT NULL,
    from_user_id uuid NOT NULL
);
CREATE TABLE public.reaction_type_enum (
    type text NOT NULL
);
CREATE TABLE public.reported_post (
    post_id uuid NOT NULL,
    reported_by_user_id uuid NOT NULL,
    is_reviewed boolean DEFAULT false NOT NULL,
    should_hide boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    id integer NOT NULL,
    review_note text
);
CREATE SEQUENCE public.reported_post_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.reported_post_id_seq OWNED BY public.reported_post.id;
CREATE TABLE public."user" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    username text NOT NULL,
    email text,
    birthday date,
    phone_number text,
    full_name jsonb DEFAULT jsonb_build_object() NOT NULL,
    profile_picture_img_id uuid,
    auth_id text,
    pronoun text,
    is_test_user boolean DEFAULT false NOT NULL,
    invite_code text,
    CONSTRAINT username_format CHECK ((((length(username) >= 2) AND (length(username) <= 15)) AND (username ~ '^[a-z0-9._]+$'::text)))
);
CREATE TABLE public.user_feed (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    post_id uuid NOT NULL,
    group_id uuid NOT NULL
);
CREATE TABLE public.user_group_edge (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    group_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);
CREATE TABLE public.user_post_edge (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    post_id uuid NOT NULL
);
ALTER TABLE ONLY public.group_join_request ALTER COLUMN id SET DEFAULT nextval('public.group_join_request_id_seq'::regclass);
ALTER TABLE ONLY public.mascot_image_reusable ALTER COLUMN id SET DEFAULT nextval('public.mascot_image_reusable_id_seq'::regclass);
ALTER TABLE ONLY public.mascot_image_reusable ALTER COLUMN serial_number SET DEFAULT nextval('public.mascot_image_reusable_serial_number_seq'::regclass);
ALTER TABLE ONLY public.mascot_image_unused ALTER COLUMN id SET DEFAULT nextval('public.mascot_image_unused_id_seq'::regclass);
ALTER TABLE ONLY public.mascot_image_used ALTER COLUMN id SET DEFAULT nextval('public.mascot_image_used_id_seq'::regclass);
ALTER TABLE ONLY public.reported_post ALTER COLUMN id SET DEFAULT nextval('public.reported_post_id_seq'::regclass);
ALTER TABLE ONLY public.user_post_edge
    ADD CONSTRAINT "UserPostEdge_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY public.comment
    ADD CONSTRAINT comment_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.group_join_request
    ADD CONSTRAINT group_join_request_id_key UNIQUE (id);
ALTER TABLE ONLY public.group_join_request
    ADD CONSTRAINT group_join_request_pkey PRIMARY KEY (group_id, user_id);
ALTER TABLE ONLY public."group"
    ADD CONSTRAINT group_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public."group"
    ADD CONSTRAINT group_profile_picture_img_id_key UNIQUE (profile_picture_serial_number);
ALTER TABLE ONLY public.image
    ADD CONSTRAINT image_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.mascot_image_reusable
    ADD CONSTRAINT mascot_image_reusable_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.mascot_image_reusable
    ADD CONSTRAINT mascot_image_reusable_serial_number_key UNIQUE (serial_number);
ALTER TABLE ONLY public.mascot_image_unused
    ADD CONSTRAINT mascot_image_unused_pkey PRIMARY KEY (id, serial_number);
ALTER TABLE ONLY public.mascot_image_unused
    ADD CONSTRAINT mascot_image_unused_serial_number_key UNIQUE (serial_number);
ALTER TABLE ONLY public.mascot_image_used
    ADD CONSTRAINT mascot_image_used_pkey PRIMARY KEY (id, serial_number);
ALTER TABLE ONLY public.mascot_image_used
    ADD CONSTRAINT mascot_image_used_serial_number_key UNIQUE (serial_number);
ALTER TABLE ONLY public.photo_post
    ADD CONSTRAINT photo_post_pkey1 PRIMARY KEY (id);
ALTER TABLE ONLY public.post
    ADD CONSTRAINT post_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.post_type_enum
    ADD CONSTRAINT post_type_enum_pkey PRIMARY KEY (type);
ALTER TABLE ONLY public.pronoun_type_enum
    ADD CONSTRAINT pronoun_type_enum_pkey PRIMARY KEY (pronoun);
ALTER TABLE ONLY public.pronoun_type_enum
    ADD CONSTRAINT pronoun_type_enum_value_key UNIQUE (value);
ALTER TABLE ONLY public.push_token
    ADD CONSTRAINT push_token_id_key UNIQUE (id);
ALTER TABLE ONLY public.push_token
    ADD CONSTRAINT push_token_pkey PRIMARY KEY (user_id, device_id);
ALTER TABLE ONLY public.reaction
    ADD CONSTRAINT reaction_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.reaction_type_enum
    ADD CONSTRAINT reaction_type_enum_pkey PRIMARY KEY (type);
ALTER TABLE ONLY public.reported_post
    ADD CONSTRAINT reported_post_pkey PRIMARY KEY (post_id, reported_by_user_id);
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_auth_id_key UNIQUE (auth_id);
ALTER TABLE ONLY public.user_feed
    ADD CONSTRAINT user_feed_group_id_key UNIQUE (group_id);
ALTER TABLE ONLY public.user_feed
    ADD CONSTRAINT user_feed_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.user_feed
    ADD CONSTRAINT user_feed_post_id_key UNIQUE (post_id);
ALTER TABLE ONLY public.user_feed
    ADD CONSTRAINT user_feed_user_id_key UNIQUE (user_id);
ALTER TABLE ONLY public.user_group_edge
    ADD CONSTRAINT user_group_edge_pkey PRIMARY KEY (user_id, group_id);
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_id_key UNIQUE (id);
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_phone_number_key UNIQUE (phone_number);
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_username_key UNIQUE (username);
CREATE TRIGGER set_public_group_join_request_updated_at BEFORE UPDATE ON public.group_join_request FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_group_join_request_updated_at ON public.group_join_request IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_group_updated_at BEFORE UPDATE ON public."group" FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_group_updated_at ON public."group" IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_mascot_image_reusable_updated_at BEFORE UPDATE ON public.mascot_image_reusable FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_mascot_image_reusable_updated_at ON public.mascot_image_reusable IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_post_updated_at BEFORE UPDATE ON public.post FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_post_updated_at ON public.post IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_push_token_updated_at BEFORE UPDATE ON public.push_token FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_push_token_updated_at ON public.push_token IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_user_updated_at BEFORE UPDATE ON public."user" FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_user_updated_at ON public."user" IS 'trigger to set value of column "updated_at" to current timestamp on row update';
