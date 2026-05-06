<?php $slug = $block->playground() ?>
<?php snippet('components/Playground', [
  'slug' => $slug,
  'caption' => $block->caption()->kirbytext()
]) ?>
