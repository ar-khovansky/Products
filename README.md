products
========


Запуск
------

$ cd products/
$ composer install
$ php app/console doctrine:database:create
$ php app/console server:run


Функции
-------

* CRUD операции
* Загрузка изображений
* Один пользователь (без авторизации)


Библиотеки
----------

Сервер:
* Symfony
* Doctrine ORM
* FOS REST Bundle

Клиент:
* AngularJS
* ngResource - REST
* Angular UI Router
* Angular UI Bootstrap
* Angular file upload (https://github.com/danialfarid/ng-file-upload)


TODO
----

* Клиент: обновление отдельного продукта без перезагрузки списка.
* Несколько пользователей и авторизация.
