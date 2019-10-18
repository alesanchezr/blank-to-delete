<?php

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
require("./vendor/autoload.php");

$api = new \SlimAPI\SlimAPI([
    'name' => 'My Super Duper API',

	'debug' => true
]);
$api->addDB('json', new \JsonPDO\JsonPDO('./data','[]',false));

$api->get('/projects', function (Request $request, Response $response, array $args) use ($api) {

    $projects = $api->db['json']->getJsonByName('projects');

	return $response->withJson($projects);
});

$api->post('/projects', function (Request $request, Response $response, array $args) use ($api) {

    $projects = $api->db['json']->getJsonByName('projects');

	return $response->withJson($projects);
});

$api->get('/minute/{username}', function (Request $request, Response $response, array $args) use ($api) {

    if(!isset($args['username'])) throw new Exception('The username is missing on the URL');
    $db = new \JsonPDO\JsonPDO('./minutes/projects.json','{}',false);

    $someData = [ "ve" => "venezuela" ];
    $file = $orm->toNewFile('countries');
    $file->save($content);

	return $response->withJson(["Hello World"]);
});

$api->get('/todos', function (Request $request, Response $response, array $args) use ($api) {
	return $response->withJson(["Hello World"]);
});

$api->run();