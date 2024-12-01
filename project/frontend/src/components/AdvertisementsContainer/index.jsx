import React, { useState, useEffect } from "react";
import axios from "../../utils/axios.js";
import { Row, Col, Card, Button, Pagination, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { SearchSort } from "./SearchSort.jsx";

export const AdvertisementsContainer = () => {
    const [advertisements, setAdvertisements] = useState([]);
    const [images, setImages] = useState({});
    const [fakeImage, setFakeImage] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [adsPerPage] = useState(12);
    const [sortProperty, setSortProperty] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');

    // Поиск
    const [searchBrand, setSearchBrand] = useState('');
    const [searchModel, setSearchModel] = useState('');
    const [searchTransmission, setSearchTransmission] = useState(null);
    const [searchEngine, setSearchEngine] = useState(null);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [minDate, setMinDate] = useState('');
    const [maxDate, setMaxDate] = useState((new Date()).toISOString().split('T')[0]);

    // Данные для поиска
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [transmissions, setTransmissions] = useState([]);
    const [engines, setEngines] = useState([]);

    

    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdvertisements = async () => {
            try {
                const response = await axios.get('/advertisements');
                setAdvertisements(response.data);
                fetchImages(response.data);
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
            }
        };

        fetchAdvertisements();
    }, []);

    

    const fetchImages = async (ads) => {
        const newImages = {};
        const fakeImageUrl = 'uploads/no_car.jpg';
        const responseFake = await axios.get(fakeImageUrl, { responseType: 'blob' });
        const objectFakeUrl = URL.createObjectURL(responseFake.data);
        setFakeImage(objectFakeUrl);

        for (const ad of ads) {
            const imageUrl = ad.photos.length > 0 ? ad.photos[0] : '';
            try {
                if (imageUrl) {
                    const response = await axios.get(imageUrl, { responseType: 'blob' });
                    const objectUrl = URL.createObjectURL(response.data);
                    newImages[ad.car_id] = objectUrl;
                }
            } catch (error) {
                console.error('Ошибка при получении изображения:', error);
            }
        }
        setImages(newImages);
    };

    const handleBrandChange = async (e) => {
      const selectedBrand = e.target.value;
      setSearchBrand(selectedBrand);
      setSearchModel(''); // Сбрасываем модель при изменении марки

      if (selectedBrand) {
          try {
              const response = await axios.get(`/models?brandName=${selectedBrand}`); // Эндпоинт для получения моделей по марке
              setModels(response.data);
          } catch (error) {
              console.error('Ошибка при получении моделей:', error);
          }
      } else {
          setModels([]); // Если марка не выбрана, сбрасываем модели
      }
  };

    const convertPriceFormat = (priceString) => {
        const cleanedString = priceString.replace(/Br/g, '').replace(/\s/g, '');
        const formattedString = cleanedString.replace(',', '.');
        return parseFloat(formattedString);
    };

    const filteredAdvertisements = advertisements
        .filter(ad => {
          console.log(ad);
          console.log(searchBrand);
          console.log(searchModel);
          console.log(searchTransmission);
          console.log(searchEngine);
            const matchesBrand = searchBrand ? ad.brand_name === searchBrand : true;
            const matchesModel = searchModel ? ad.model_name === searchModel : true;
            const matchesTransmission = searchTransmission ? ad.transmission_name === searchTransmission : true;
            const matchesEngine = searchEngine ? ad.engine_name === searchEngine : true;

            const price = convertPriceFormat(ad.price);
            const matchesPrice = (minPrice ? price >= parseFloat(minPrice) : true) &&
                                 (maxPrice ? price <= parseFloat(maxPrice) : true);

            const manufactureDate = new Date(ad.manufacture_date);
            const matchesDate = (minDate ? manufactureDate >= new Date(minDate) : true) &&
                                (maxDate ? manufactureDate <= new Date(maxDate) : true);

            return matchesBrand && matchesModel && matchesTransmission && matchesEngine && matchesPrice && matchesDate;
        })
        .sort((a, b) => {
            let comparison = 0;

            if (sortProperty === 'price') {
                comparison = convertPriceFormat(a.price) - convertPriceFormat(b.price);
            } else {
                if (a[sortProperty] < b[sortProperty]) {
                    comparison = -1;
                } else if (a[sortProperty] > b[sortProperty]) {
                    comparison = 1;
                }
            }
            return sortDirection === 'asc' ? comparison : -comparison;
        });

    const addAdvertisement = () => {
        navigate('/add-advertisement');
    };

    // Вычисляем объявления для текущей страницы
    const indexOfLastAd = currentPage * adsPerPage;
    const indexOfFirstAd = indexOfLastAd - adsPerPage;
    const currentAds = filteredAdvertisements.slice(indexOfFirstAd, indexOfLastAd);

    // Обработка смены страницы
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Определяем количество страниц
    const pageNumbers = Math.ceil(filteredAdvertisements.length / adsPerPage);

    // Формируем массив страниц для отображения
    const createPageArray = () => {
        const pages = [];
        for (let i = 1; i <= pageNumbers; i++) {
            if (i === 1 || i === pageNumbers || (i >= currentPage - 2 && i <= currentPage + 2)) {
                pages.push(i);
            } else if (pages[pages.length - 1] !== '...') {
                pages.push('...');
            }
        }
        return pages;
    };

    const pageArray = createPageArray();

    return (
        <>
            <SearchSort
              sortProperty={sortProperty}
              setSortProperty={setSortProperty}
              sortDirection={sortDirection}
              setSortDirection={setSortDirection}
              searchBrand={searchBrand}
              handleBrandChange={handleBrandChange}
              searchModel={searchModel}
              setSearchModel={setSearchModel}
              searchTransmission={searchTransmission}
              setSearchTransmission={setSearchTransmission}
              searchEngine={searchEngine}
              setSearchEngine={setSearchEngine}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              minDate={minDate}
              setMinDate={setMinDate}
              maxDate={maxDate}
              setMaxDate={setMaxDate}
              brands={brands}
              setBrands={setBrands}
              models={models}
              transmissions={transmissions}
              setTransmissions={setTransmissions}
              engines={engines}
              setEngines={setEngines}
              />        
            <Row xs={2} md={4} className="g-4 mb-4">
                {currentAds.map((advertisement) => (
                    <Col key={advertisement.car_id}>
                        <Card onClick={() => navigate(`/advertisements/${advertisement.advertisement_id}`)} style={{height: "450px"}}>
                            <Card.Img
                                variant="top"
                                className="d-block w-100"
                                src={images[advertisement.car_id] || fakeImage}
                                alt={`Фото ${advertisement.brand_name} ${advertisement.model_name}`}
                                style={{ height: '200px', objectFit: 'cover' }}
                            />
                            <Card.Body>
                                <Card.Title>{advertisement.brand_name + " " + advertisement.model_name}</Card.Title>
                                <Card.Text>{advertisement.description}</Card.Text>
                                <Card.Text>{advertisement.price}</Card.Text>
                                <Card.Text>{advertisement.username}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            
            {/* Пагинация */}
            <div className="text-center">
                <Pagination className="d-flex justify-content-center mb-4">
                    <Pagination.Prev onClick={() => {
                        if (currentPage > 1) {
                            setCurrentPage(currentPage - 1);
                        }
                    }}/>
                    {pageArray.map((number, index) => (
                        <Pagination.Item
                            key={index}
                            active={number === currentPage}
                            onClick={() => {
                                if (number !== '...') handlePageChange(number);
                            }}
                        >
                            {number}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => {
                        if (currentPage < pageNumbers) {
                            setCurrentPage(currentPage + 1);
                        }
                    }}/>
                </Pagination>
                <Button className="mb-4" onClick={addAdvertisement}>
                    Добавить объявление
                </Button>
            </div>
        </>
    );
};