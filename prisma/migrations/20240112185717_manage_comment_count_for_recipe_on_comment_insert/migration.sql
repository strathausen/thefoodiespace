-- when a new comment is inserted, update the recipe comment count

CREATE OR REPLACE FUNCTION update_recipe_comment_count()
RETURNS TRIGGER AS $$
BEGIN
		UPDATE recipes
		SET comment_count = comment_count + 1
		WHERE id = NEW.recipe_id;

		RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_recipe_comment_count()
RETURNS TRIGGER AS $$
BEGIN
		UPDATE recipes
		SET comment_count = GREATEST(comment_count - 1, 0)  -- Prevents negative counts
		WHERE id = OLD.recipe_id;

		RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_recipe_comment_count_trigger
AFTER INSERT ON comments
FOR EACH ROW
EXECUTE FUNCTION update_recipe_comment_count();

CREATE TRIGGER decrement_recipe_comment_count_trigger
BEFORE DELETE ON comments
FOR EACH ROW
EXECUTE FUNCTION decrement_recipe_comment_count();

