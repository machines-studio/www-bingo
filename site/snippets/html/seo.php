<link rel='icon' href='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%22-1 -1 2 2%22><circle r=%221%22 fill=%22<?= urlencode($page->color()->toHex()->or('#222')) ?>%22 /></svg>'>

<meta name='apple-mobile-web-app-title' content='machines.studio' />
<link rel='manifest' href='/assets/favicons/site.webmanifest' />
<meta name='theme-color' content='#ffffff' />

<?php foreach ($kirby->languages() as $language) : ?>
  <link rel='alternate' hreflang='<?= $language->code() ?>' href='<?= $page->url($language->code()) ?>' />
<?php endforeach ?>

<?php
  $title = r($page !== $site->homePage(), Str::unhtml($page->title()) . ' | ') . $site->title();
  $description = $page->seo_description()->or($site->seo_description());
  $keywords = implode(', ', array_unique([
    ...$site->seo_keywords()->split(),
    ...$page->seo_keywords()->split()
  ]));

  $cover = (
    $page->seo_cover()->toFile() ??
    $page->thumbnail()->toFile() ??
    $site->seo_cover()->toFile()
  )?->crop(1200, 628);

  $metas = [
    'application-name' => $title,
    'description' => $description,
    'keywords' => $keywords,
    'og:url' => $site->url(),
    'og:type' => 'website',
    'og:title' => $title,
    'og:image' => $cover?->url(),
    'og:image:width' => $cover?->width(),
    'og:image:height' => $cover?->height(),
    'og:description' => $description,
    'og:site_name' => $title,
    'og:locale' => $kirby->language()->code()
  ];

  foreach ($metas as $name => $content) {
    if (!$content) continue;
    echo Html::tag('meta', null, [
      'name' => $name,
      'property' => $name,
      'content' => Escape::html($content)
    ]);
  }
