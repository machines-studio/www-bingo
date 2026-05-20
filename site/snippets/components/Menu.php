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

<input type='checkbox' id='toggle-menu'>

<menu class='menu'>
  <h1>
    <a href='<?= $site->url() ?>'>
      <?= $site->title() ?>
    </a>
  </h1>

  <nav>
    <ul class='menu__links'>
      <?php foreach ($site->children()->listed() as $page) : ?>
        <li class='menu__link'>
          <?php snippet('html/link', $page) ?>
        </li>
      <?php endforeach ?>
    </ul>

    <ul class='menu__links'>
      <?php foreach ($socials as $link) : ?>
        <li class='menu__link'>
          <?php snippet('html/link', $link) ?>
        </li>
      <?php endforeach ?>
    </ul>
  </nav>

  <label for='toggle-menu'><?= t('menu') ?></label>
</menu>
