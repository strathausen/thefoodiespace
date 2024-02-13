-- replace recipes_ai_index to only execute when relevant infos change

DROP TRIGGER recipes_ai_index ON recipes;

CREATE TRIGGER recipes_ai_index
AFTER UPDATE OF title,
	ai_index_en,
	ai_index_de,
	ai_index_es,
	ai_index_fr,
  ai_index_it,
  ai_index_id,
  ai_index_ro
ON recipes
FOR EACH ROW
EXECUTE FUNCTION recipes_ai_index_de_trigger();
