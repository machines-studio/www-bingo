<?php snippet('components/Article', [
  'title' => $page->title(),
  'subtitle' => $page->subtitle(),
  'layouts' => $page->layout()->toLayouts()
]) ?>
