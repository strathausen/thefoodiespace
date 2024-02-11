-- on update of recipes, fill text_index_* with to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(ai_index_*, ''));

-- CreateTrigger
CREATE OR REPLACE FUNCTION recipes_ai_index_de_trigger() RETURNS TRIGGER AS $$
BEGIN
	NEW.text_index_en := to_tsvector('simple', coalesce(NEW.title, '')) || ' ' || to_tsvector('english',    coalesce(NEW.ai_index_en, ''));
  NEW.text_index_de := to_tsvector('simple', coalesce(NEW.title, '')) || ' ' || to_tsvector('german',     coalesce(NEW.ai_index_de, ''));
	NEW.text_index_es := to_tsvector('simple', coalesce(NEW.title, '')) || ' ' || to_tsvector('spanish',    coalesce(NEW.ai_index_es, ''));
	NEW.text_index_fr := to_tsvector('simple', coalesce(NEW.title, '')) || ' ' || to_tsvector('french',     coalesce(NEW.ai_index_fr, ''));
	NEW.text_index_id := to_tsvector('simple', coalesce(NEW.title, '')) || ' ' || to_tsvector('indonesian', coalesce(NEW.ai_index_id, ''));
	NEW.text_index_it := to_tsvector('simple', coalesce(NEW.title, '')) || ' ' || to_tsvector('italian',    coalesce(NEW.ai_index_it, ''));
	NEW.text_index_ro := to_tsvector('simple', coalesce(NEW.title, '')) || ' ' || to_tsvector('romanian',   coalesce(NEW.ai_index_ro, ''));
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER recipes_ai_index
BEFORE INSERT OR UPDATE ON recipes
FOR EACH ROW
EXECUTE FUNCTION recipes_ai_index_de_trigger();

-- gin index
CREATE INDEX text_index_en_idx ON recipes USING gin(text_index_en);
CREATE INDEX text_index_de_idx ON recipes USING gin(text_index_de);
CREATE INDEX text_index_es_idx ON recipes USING gin(text_index_es);
CREATE INDEX text_index_fr_idx ON recipes USING gin(text_index_fr);
CREATE INDEX text_index_id_idx ON recipes USING gin(text_index_id);
CREATE INDEX text_index_it_idx ON recipes USING gin(text_index_it);
CREATE INDEX text_index_ro_idx ON recipes USING gin(text_index_ro);
