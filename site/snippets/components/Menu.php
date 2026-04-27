<?php
  $socials = [
    [
      'url' => r($site->email()->isNotEmpty(), 'mailto:' . $site->email()),
      'title' => 'email'
    ],

    [
      'url' => r($site->instagram()->isNotEmpty(), 'https://linkedin.com/' . $site->linkedin()),
      'title' => 'linkedin'
    ],

    [
      'url' => r($site->instagram()->isNotEmpty(), 'https://instagram.com/' . $site->instagram()),
      'title' => 'instagram'
    ]
  ]
?>

<nav class='menu'>
  <div class='flexgroup'>
    <h1>
      <a href='<?= $site->url() ?>'>
        <?= $site->title() ?>
      </a>
    </h1>

    <ul class='menu__links'>
      <?php foreach ($site->children()->listed() as $page) : ?>
        <li class='menu__link'>
          <?php snippet('html/link', $page) ?>
        </li>
      <?php endforeach ?>
    </ul>
  </div>

  <ul class='menu__links'>
    <?php foreach ($socials as $link) : ?>
      <li class='menu__link'>
        <?php snippet('html/link', $link) ?>
      </li>
    <?php endforeach ?>
  </ul>
</nav>
