import sys, os
sys.path.insert(0, 'backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
import django; django.setup()
from courses.models import Course, Category, Topic, Lesson
from users.models import CustomUser

teacher = CustomUser.objects.filter(is_staff=True).first()
cat, _ = Category.objects.get_or_create(name='Mexanika', defaults={'slug': 'mexanika'})

c = Course.objects.get(id=1)
c.title = 'Kinematika'
c.slug = 'kinematika'
c.description = "Jismlar harakati: tezlik, tezlanish va yo'l hisoblash qonunlari."
c.category = cat
c.teacher = teacher
c.level = 'beginner'
c.is_published = True
c.is_free = True
c.save()
print('Updated Kinematika')

if c.topics.count() == 0:
    for i in range(8):
        topic = Topic.objects.create(course=c, title=f'Mavzu {i+1}', order=i)
        for j in range(2):
            Lesson.objects.create(
                topic=topic,
                title=f'Dars {j+1}: Mavzu {i+1} — Kinematika',
                content="Dars matni kelgusida qo'shiladi.",
                lesson_type='text',
                order=j,
                is_free_preview=(j == 0),
            )
    print('Added topics and lessons')

print(f'Total courses: {Course.objects.count()}')
c_check = Course.objects.get(id=1)
print(f'ID=1: {c_check.title} (published={c_check.is_published})')
