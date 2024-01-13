-- use count for commentCount instead of increment/decrement

CREATE OR REPLACE FUNCTION update_recipe_comment_count()
RETURNS TRIGGER AS $$
BEGIN
		UPDATE recipes
		SET comment_count = (SELECT COUNT(*) FROM comments WHERE recipe_id = NEW.recipe_id)
		WHERE id = NEW.recipe_id;

		RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_recipe_comment_count()
RETURNS TRIGGER AS $$
BEGIN
		UPDATE recipes
		SET comment_count = (SELECT COUNT(*) FROM comments WHERE recipe_id = OLD.recipe_id)
		WHERE id = OLD.recipe_id;

		RETURN OLD;
END;
$$ LANGUAGE plpgsql;