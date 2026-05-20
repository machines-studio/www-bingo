<?php snippet('components/Playground', [
  'slug' => $block->playground(),
  'url' => $block->page()->toPage()?->url(),
  'caption' => $block->caption()->kirbytext()
]) ?>
