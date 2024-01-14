-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
DROP TRIGGER decrement_recipe_comment_count_trigger ON comments;

CREATE TRIGGER decrement_recipe_comment_count_trigger
AFTER DELETE ON comments
FOR EACH ROW
EXECUTE FUNCTION decrement_recipe_comment_count();