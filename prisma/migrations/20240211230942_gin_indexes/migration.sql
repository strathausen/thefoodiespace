-- CreateIndex
CREATE INDEX "recipes_text_index_en_idx" ON "recipes" USING GIN ("text_index_en");

-- CreateIndex
CREATE INDEX "recipes_text_index_de_idx" ON "recipes" USING GIN ("text_index_de");

-- CreateIndex
CREATE INDEX "recipes_text_index_es_idx" ON "recipes" USING GIN ("text_index_es");

-- CreateIndex
CREATE INDEX "recipes_text_index_fr_idx" ON "recipes" USING GIN ("text_index_fr");

-- CreateIndex
CREATE INDEX "recipes_text_index_it_idx" ON "recipes" USING GIN ("text_index_it");

-- CreateIndex
CREATE INDEX "recipes_text_index_id_idx" ON "recipes" USING GIN ("text_index_id");

-- CreateIndex
CREATE INDEX "recipes_text_index_ro_idx" ON "recipes" USING GIN ("text_index_ro");
