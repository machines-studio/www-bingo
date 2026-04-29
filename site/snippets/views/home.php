<section class='splashcreen'>
  <?php snippet('svg/title') ?>
</section>

<?php snippet('components/Article', [
  'title' => 'L’expérience de la couleur',
  'anchor' => 'content1',
  'nav' => Html::a('#content1', '↓'),
  'content' => 'coucou'
]) ?>
