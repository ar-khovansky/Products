<?php

namespace AppBundle\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Validator\ConstraintViolationListInterface;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;

use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Controller\Annotations\Get;
use FOS\RestBundle\Controller\Annotations\Post;
use FOS\RestBundle\Controller\Annotations\Put;
use FOS\RestBundle\Controller\Annotations\Delete;
use FOS\RestBundle\Controller\Annotations\View;

use AppBundle\Entity\Product;
use Symfony\Component\Validator\Exception\ValidatorException;


/**
 * Product controller.
 */
class ProductController extends FosRestController
{
    /**
     * @Get("/products")
     */
    public function cgetAction()
    {
        $em = $this->getDoctrine()->getManager();
        return $em->getRepository('AppBundle:Product')->findAll();
    }

    /**
     * @Post("/products")
     * @ParamConverter("product", converter="fos_rest.request_body")
     */
    public function postAction(Product $product,
                               ConstraintViolationListInterface $validationErrors)
    {
//        var_dump($product);
//        var_dump($validationErrors);

        if (count($validationErrors) > 0) {
            throw new BadRequestHttpException((string)$validationErrors);
        }

        $em = $this->getDoctrine()->getManager();
        $em->persist($product);
        $em->flush();

        return $this->view(null, Response::HTTP_CREATED,
            array('Location' =>
                  $this->generateUrl('app_product_get', array('id' => $product->getId()), true)));
    }

    /**
     * @Get("/products/{id}")
     * @View
     */
    public function getAction(Product $product)
    {
        return $product;
    }

    /**
     * @Put("/products/{id}")
     * @ParamConverter("new_product", converter="fos_rest.request_body")
     * @View(populateDefaultVars=false)
     */
    public function putAction(Product $product,
                              Product $new_product,
                              ConstraintViolationListInterface $validationErrors)
    {
        if (count($validationErrors) > 0) {
            throw new BadRequestHttpException((string)$validationErrors);
        }

        $product->copyFrom($new_product);

        $em = $this->getDoctrine()->getManager();
        $em->flush();
    }

    /**
     * @Delete("/products/{id}")
     * @View(populateDefaultVars=false)
     */
    public function deleteAction(Product $product)
    {
        $em = $this->getDoctrine()->getManager();

        $em->remove($product);
        $em->flush();
    }
}
