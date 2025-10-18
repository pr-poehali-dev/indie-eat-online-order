import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  points: number;
  emoji: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

const menuItems: MenuItem[] = [
  { id: 1, name: 'Indie Бургер', price: 350, description: 'Сочная котлета, свежие овощи, фирменный соус', category: 'burgers', points: 35, emoji: '🍔' },
  { id: 2, name: 'Чизбургер Делюкс', price: 420, description: 'Двойной сыр чеддер, бекон, карамелизированный лук', category: 'burgers', points: 42, emoji: '🧀' },
  { id: 3, name: 'Веган Бургер', price: 380, description: 'Растительная котлета, авокадо, томаты', category: 'burgers', points: 38, emoji: '🥑' },
  { id: 4, name: 'Картофель Фри', price: 150, description: 'Хрустящий картофель с морской солью', category: 'sides', points: 15, emoji: '🍟' },
  { id: 5, name: 'Наггетсы (6 шт)', price: 200, description: 'Куриные наггетсы с соусом на выбор', category: 'sides', points: 20, emoji: '🍗' },
  { id: 6, name: 'Луковые кольца', price: 180, description: 'Золотистые луковые кольца в панировке', category: 'sides', points: 18, emoji: '🧅' },
  { id: 7, name: 'Кола 0.5л', price: 120, description: 'Охлажденная Coca-Cola', category: 'drinks', points: 12, emoji: '🥤' },
  { id: 8, name: 'Милкшейк Ваниль', price: 180, description: 'Густой ванильный молочный коктейль', category: 'drinks', points: 18, emoji: '🥛' },
];

const promos = [
  { id: 1, title: 'Комбо за 500₽', description: 'Бургер + Картофель Фри + Напиток', discount: '20%', color: 'bg-red-500' },
  { id: 2, title: 'Счастливые часы', description: 'Скидка 30% с 14:00 до 16:00', discount: '30%', color: 'bg-purple-500' },
  { id: 3, title: 'За 1000 баллов', description: 'Бесплатный бургер на выбор', discount: 'FREE', color: 'bg-orange-500' },
];

const reviews = [
  { id: 1, name: 'Анна М.', rating: 5, text: 'Лучшие бургеры в городе! Доставка всегда вовремя 🎉', avatar: '👩' },
  { id: 2, name: 'Дмитрий К.', rating: 5, text: 'Система баллов супер! Уже накопил на бесплатный заказ', avatar: '👨' },
  { id: 3, name: 'Елена В.', rating: 4, text: 'Вкусно и быстро. Картошка фри просто огонь!', avatar: '👱‍♀️' },
];

const Index = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loyaltyPoints, setLoyaltyPoints] = useState(450);
  const [activeSection, setActiveSection] = useState('menu');

  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: number) => {
    const item = cart.find(cartItem => cartItem.id === id);
    if (item && item.quantity > 1) {
      setCart(cart.map(cartItem => 
        cartItem.id === id 
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      ));
    } else {
      setCart(cart.filter(cartItem => cartItem.id !== id));
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalPoints = cart.reduce((sum, item) => sum + item.points * item.quantity, 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const checkout = () => {
    setLoyaltyPoints(loyaltyPoints + totalPoints);
    setCart([]);
    alert(`Заказ оформлен! Вы получили ${totalPoints} баллов 🎉`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b-4 border-primary shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-5xl animate-bounce">🍔</div>
              <div>
                <h1 className="text-3xl font-bold text-primary">Indie eat</h1>
                <p className="text-sm text-muted-foreground">Быстро. Вкусно. Весело!</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                <CardContent className="p-3 flex items-center gap-2">
                  <Icon name="Star" size={20} className="fill-yellow-300 text-yellow-300" />
                  <div>
                    <p className="text-xs opacity-90">Ваши баллы</p>
                    <p className="text-xl font-bold">{loyaltyPoints}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Button 
                size="lg" 
                className="relative shadow-lg shadow-primary/50"
                onClick={() => setActiveSection('menu')}
              >
                <Icon name="ShoppingCart" size={20} />
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white animate-bounce">
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b sticky top-[88px] z-40">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-3">
            {['menu', 'delivery', 'promos', 'about', 'reviews'].map((section) => (
              <Button
                key={section}
                variant={activeSection === section ? 'default' : 'ghost'}
                onClick={() => setActiveSection(section)}
                className="whitespace-nowrap"
              >
                {section === 'menu' && '🍽️ Меню'}
                {section === 'delivery' && '🚚 Доставка'}
                {section === 'promos' && '🎁 Акции'}
                {section === 'about' && 'ℹ️ О нас'}
                {section === 'reviews' && '⭐ Отзывы'}
              </Button>
            ))}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {activeSection === 'menu' && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-5xl font-bold mb-3">Наше Меню 🎮</h2>
              <p className="text-xl text-muted-foreground">Выбери свое идеальное комбо!</p>
            </div>

            <Tabs defaultValue="burgers" className="mb-8">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="burgers">🍔 Бургеры</TabsTrigger>
                <TabsTrigger value="sides">🍟 Закуски</TabsTrigger>
                <TabsTrigger value="drinks">🥤 Напитки</TabsTrigger>
              </TabsList>

              {['burgers', 'sides', 'drinks'].map((category) => (
                <TabsContent key={category} value={category}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menuItems.filter(item => item.category === category).map((item) => (
                      <Card key={item.id} className="transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border-2 hover:border-primary">
                        <CardHeader>
                          <div className="text-6xl mb-3 text-center">{item.emoji}</div>
                          <CardTitle className="text-xl">{item.name}</CardTitle>
                          <CardDescription>{item.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-2xl font-bold text-primary">{item.price}₽</span>
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <Icon name="Star" size={14} />
                              +{item.points}
                            </Badge>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button 
                            className="w-full" 
                            onClick={() => addToCart(item)}
                          >
                            <Icon name="Plus" size={18} />
                            Добавить
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            {cart.length > 0 && (
              <Card className="border-4 border-primary shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="ShoppingBag" size={24} />
                    Ваш заказ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between mb-3 pb-3 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{item.emoji}</span>
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.price}₽ × {item.quantity}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => removeFromCart(item.id)}>
                          <Icon name="Minus" size={16} />
                        </Button>
                        <span className="w-8 text-center font-bold">{item.quantity}</span>
                        <Button size="sm" variant="outline" onClick={() => addToCart(item)}>
                          <Icon name="Plus" size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-lg">
                      <span>Итого:</span>
                      <span className="font-bold text-2xl text-primary">{totalPrice}₽</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Вы получите баллов:</span>
                      <span className="font-semibold text-purple-600">+{totalPoints} ⭐</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full text-lg py-6" size="lg" onClick={checkout}>
                    <Icon name="Check" size={20} />
                    Оформить заказ
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        )}

        {activeSection === 'delivery' && (
          <div className="animate-fade-in max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-8xl mb-4">🚚</div>
              <h2 className="text-5xl font-bold mb-3">Доставка</h2>
              <p className="text-xl text-muted-foreground">Привезем горячим за 30 минут!</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                <CardHeader>
                  <div className="text-5xl mb-3">⚡</div>
                  <CardTitle>Быстро</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Среднее время доставки всего 25 минут</p>
                </CardContent>
              </Card>

              <Card className="text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                <CardHeader>
                  <div className="text-5xl mb-3">🎯</div>
                  <CardTitle>Точно</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Отслеживайте курьера в реальном времени</p>
                </CardContent>
              </Card>

              <Card className="text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                <CardHeader>
                  <div className="text-5xl mb-3">💰</div>
                  <CardTitle>Выгодно</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Бесплатная доставка от 800₽</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Условия доставки</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <Icon name="MapPin" size={20} className="text-primary mt-1" />
                  <div>
                    <p className="font-semibold">Зона доставки</p>
                    <p className="text-sm text-muted-foreground">В пределах 5 км от ресторана</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="Clock" size={20} className="text-primary mt-1" />
                  <div>
                    <p className="font-semibold">Время работы</p>
                    <p className="text-sm text-muted-foreground">Ежедневно с 10:00 до 23:00</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="Wallet" size={20} className="text-primary mt-1" />
                  <div>
                    <p className="font-semibold">Стоимость доставки</p>
                    <p className="text-sm text-muted-foreground">150₽ (бесплатно от 800₽)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === 'promos' && (
          <div className="animate-fade-in">
            <div className="text-center mb-12">
              <div className="text-8xl mb-4">🎁</div>
              <h2 className="text-5xl font-bold mb-3">Акции и Скидки</h2>
              <p className="text-xl text-muted-foreground">Экономь с каждым заказом!</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {promos.map((promo) => (
                <Card key={promo.id} className={`${promo.color} text-white border-0 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl`}>
                  <CardHeader>
                    <Badge className="w-fit bg-white text-black mb-2">{promo.discount}</Badge>
                    <CardTitle className="text-2xl">{promo.title}</CardTitle>
                    <CardDescription className="text-white/90">{promo.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="secondary" className="w-full">
                      Использовать
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Trophy" size={24} className="text-purple-600" />
                  Программа лояльности
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>За каждые потраченные 10₽ вы получаете 1 балл!</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Ваш прогресс до следующей награды</span>
                    <span className="font-semibold">{loyaltyPoints} / 1000 баллов</span>
                  </div>
                  <Progress value={(loyaltyPoints / 1000) * 100} className="h-3" />
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon name="Gift" size={16} />
                  <span>Еще {1000 - loyaltyPoints} баллов до бесплатного бургера!</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === 'about' && (
          <div className="animate-fade-in max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-8xl mb-4">🍔</div>
              <h2 className="text-5xl font-bold mb-3">О нас</h2>
              <p className="text-xl text-muted-foreground">История Indie eat</p>
            </div>

            <Card className="mb-6">
              <CardContent className="pt-6 space-y-4">
                <p className="text-lg">
                  Indie eat — это не просто фастфуд, это целая философия! Мы создаем атмосферу,
                  где каждый заказ превращается в маленькое приключение.
                </p>
                <p>
                  Наша миссия — делать качественную еду доступной, быструю доставку надежной,
                  а процесс заказа увлекательным и веселым!
                </p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardHeader>
                  <div className="text-5xl mb-3">🏆</div>
                  <CardTitle>5+ лет</CardTitle>
                  <CardDescription>На рынке фастфуда</CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="text-5xl mb-3">🌟</div>
                  <CardTitle>50K+</CardTitle>
                  <CardDescription>Довольных клиентов</CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="text-5xl mb-3">📍</div>
                  <CardTitle>15</CardTitle>
                  <CardDescription>Точек по городу</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        )}

        {activeSection === 'reviews' && (
          <div className="animate-fade-in max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-8xl mb-4">⭐</div>
              <h2 className="text-5xl font-bold mb-3">Отзывы</h2>
              <p className="text-xl text-muted-foreground">Что говорят наши клиенты</p>
            </div>

            <div className="grid md:grid-cols-1 gap-6">
              {reviews.map((review) => (
                <Card key={review.id} className="transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{review.avatar}</div>
                      <div>
                        <CardTitle className="text-lg">{review.name}</CardTitle>
                        <div className="flex gap-1 mt-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <Icon key={i} name="Star" size={16} className="fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg">{review.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-6 bg-gradient-to-r from-orange-100 to-red-100 border-2 border-orange-300">
              <CardHeader>
                <CardTitle>Оставьте свой отзыв!</CardTitle>
                <CardDescription>Получите 50 бонусных баллов за отзыв</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className="w-full">
                  <Icon name="MessageCircle" size={18} />
                  Написать отзыв
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </main>

      <footer className="bg-gray-900 text-white mt-20 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-4xl">🍔</span> Indie eat
              </h3>
              <p className="text-gray-400">Быстро. Вкусно. Весело!</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Контакты</h4>
              <p className="text-sm text-red-900">📞 +7 915 405-72-33</p>
              <p className="text-gray-400 text-sm">📧 junromosa@yandex.ru</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Время работы</h4>
              <p className="text-gray-400 text-sm">Ежедневно</p>
              <p className="text-gray-400 text-sm">10:00 - 23:00</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Соцсети</h4>
              <div className="flex gap-3 text-2xl">
                <span>📱</span>
                <span>💬</span>
                <span>📸</span>
              </div>
            </div>
          </div>
          <Separator className="my-8 bg-gray-700" />
          <p className="text-center text-gray-400 text-sm">© 2024 Indie eat. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;