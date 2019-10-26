<?php

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
require("./vendor/autoload.php");

$api = new \SlimAPI\SlimAPI([
    'name' => 'My Super Duper API',
    'allowedURLs' => 'all',
	'debug' => false
]);

if(!file_exists('./data/')) mkdir('./data/');

$api->get('/companies', function (Request $request, Response $response, array $args) use ($api) {
    $db = new \JsonPDO\JsonPDO('./data','[]',false);
    $companies = $db->getJsonByName('companies');
	return $response->withJson($companies);
});

$api->post('/companies', function (Request $request, Response $response, array $args) use ($api) {

    $body = $request->getParsedBody();
    $value = $api->validate($body,'value')->string();

    $db = new \JsonPDO\JsonPDO('./data','[]',false);

    try{
        $companies = $db->getJsonByName('companies');
        $companies[] = $value;
        $file = $db->toFile('companies');
        $file->save($companies);
	    return $response->withJson($companies);
    }
    catch(Exception $e){
        $file = $db->toNewFile('companies');
        $file->save([$value]);
        return $response->withJson([$value]);
    }

});

$api->get('/projects/{company}', function (Request $request, Response $response, array $args) use ($api) {
    $db = new \JsonPDO\JsonPDO('./data/'.$args["company"].'/','[]',false);
    $projects = $db->getJsonByName('projects');
	return $response->withJson($projects);
});

$api->post('/projects/{company}', function (Request $request, Response $response, array $args) use ($api) {

    $body = $request->getParsedBody();
    $value = $api->validate($body,'value')->slug();

    $db = new \JsonPDO\JsonPDO('./data/'.$args["company"].'/','[]',false);
    if(!file_exists('./data/'.$args["company"])) mkdir('./data/'.$args["company"]);

    try{
        $projects = $db->getJsonByName('projects');
        $projects[] = $value;
        $file = $db->toFile('projects');
        $file->save($projects);
	    return $response->withJson($projects);
    }
    catch(Exception $e){
        $file = $db->toNewFile('projects');
        $file->save([$value]);
        return $response->withJson([$value]);
    }
});

$api->get('/members/{company}', function (Request $request, Response $response, array $args) use ($api) {
    $db = new \JsonPDO\JsonPDO('./data/'.$args["company"].'/','[]',false);
    $members = $db->getJsonByName('members');
	return $response->withJson($members);
});

$api->post('/members/{company}', function (Request $request, Response $response, array $args) use ($api) {

    $body = $request->getParsedBody();
    $initials = $api->validate($body,'initials')->slug();
    $full_name = $api->validate($body,'full_name')->string();

    $db = new \JsonPDO\JsonPDO('./data/'.$args["company"].'/','[]',false);
    if(!file_exists('./data/'.$args["company"])) mkdir('./data/'.$args["company"]);
    $new = [
            "initials" => $initials,
            "full_name" => $full_name
        ];
    try{
        $members = $db->getJsonByName('members');
        $members[] = $new;
        $file = $db->toFile('members');
        $file->save($members);
	    return $response->withJson($members);
    }
    catch(Exception $e){
        $file = $db->toNewFile('members');
        $file->save([$new]);
	    return $response->withJson([$new]);
    }

});

$api->get('/minutes/company/{company}', function (Request $request, Response $response, array $args) use ($api) {
    $db = new \JsonPDO\JsonPDO('./data/'.$args["company"].'/','[]',false);
    $minutes = $db->getJsonByName('minutes');
	return $response->withJson($minutes);
});

$api->post('/minutes/company/{company}', function (Request $request, Response $response, array $args) use ($api) {

    $body = $request->getParsedBody();
    $id = $api->validate($body,'id')->int();
    $date = $api->validate($body,'date')->string();
    $author = $api->validate($body,'author')->string();
    $tittle = $api->validate($body,'tittle')->string();
    $status = $api->validate($body,'status')->enum(['closed', 'open']);
    $attendees = $api->validate($body,'attendees')->string();

    $new = [
        "id" => $id,
        "date" => $date,
        "author" => $author,
        "status" => $status,
        "attendees" => $attendees,
        "tittle" => isset($tittle) ? $tittle : $date,
        "bullets" => (array) $body["bullets"]
    ];

    $db = new \JsonPDO\JsonPDO('./data/'.$args["company"].'/','[]',false);
    if(!file_exists('./data/'.$args["company"])) mkdir('./data/'.$args["company"]);
    try{

        $minutes = $db->getJsonByName('minutes');
        $file = $db->toFile('minutes');
        if(count($minutes) == 0){
            $file->save([$new]);
            return $response->withJson([$new]);
        }

        $found = false;
        $newMinutes = [];
        foreach($minutes as $m){
            if($m->id == $id){
                $newMinutes[] = $new;
                $found = true;
            }
            else  $newMinutes[] = $m;
        }

        if(!$found) $newMinutes[] = $new;

        $file->save($newMinutes);
	    return $response->withJson($newMinutes);
    }catch(Exception $e){
        $file = $db->toNewFile('minutes');
        $file->save([$new]);
        return $response->withJson([$new]);
    }

});

$api->delete('/minutes/{company}/{minute_id}', function (Request $request, Response $response, array $args) use ($api) {

    $db = new \JsonPDO\JsonPDO('./data/'.$args["company"].'/','[]',false);
    $minutes = $db->getJsonByName('minutes');
    $file = $db->toFile('minutes');

    $newMinutes = [];
    foreach($minutes as $m){
        if($m->id == $args["minute_id"]) continue;
        else  $newMinutes[] = $m;
    }

    $file->save($newMinutes);
    return $response->withJson($newMinutes);

});

$api->run();