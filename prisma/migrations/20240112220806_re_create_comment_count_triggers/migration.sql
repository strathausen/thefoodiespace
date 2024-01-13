DROP TRIGGER update_recipe_comment_count_trigger ON comments;
DROP TRIGGER decrement_recipe_comment_count_trigger ON comments;


CREATE TRIGGER update_recipe_comment_count_trigger
AFTER INSERT ON comments
FOR EACH ROW
EXECUTE FUNCTION update_recipe_comment_count();

CREATE TRIGGER decrement_recipe_comment_count_trigger
BEFORE DELETE ON comments
FOR EACH ROW
EXECUTE FUNCTION decrement_recipe_comment_count();