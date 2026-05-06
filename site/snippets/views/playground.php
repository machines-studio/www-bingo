<?php snippet('components/Article', [
  'symbol' => 'playgrounds/',
  'title' => $page->title(),
  'content' => snippet('components/Playground', ['slug' => $page->slug()], true)
]) ?>
