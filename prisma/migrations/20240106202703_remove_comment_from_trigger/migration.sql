CREATE OR REPLACE FUNCTION update_recipe_counts()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the reaction type is 'LIKE' and update like_count
    IF NEW.type = 'LIKE' THEN
        UPDATE recipes
        SET like_count = like_count + 1
        WHERE id = NEW.recipe_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_recipe_counts()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the reaction type is 'LIKE' and decrement like_count
    IF OLD.type = 'LIKE' THEN
        UPDATE recipes
        SET like_count = GREATEST(like_count - 1, 0)  -- Prevents negative counts
        WHERE id = OLD.recipe_id;
    END IF;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;