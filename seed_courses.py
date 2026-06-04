"""
15 ta fizika kursini bazaga qo'shish uchun script.
Ishlatish: python seed_courses.py (fizika-platform papkasida)
"""
import sys, os
sys.path.insert(0, 'backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
import django; django.setup()

from courses.models import Course, Category, Topic, Lesson
from users.models import CustomUser

teacher = CustomUser.objects.filter(is_staff=True).first()
if not teacher:
    teacher = CustomUser.objects.first()
print(f"Teacher: {teacher.username}")

cat_names = ['Mexanika', 'Termodinamika', 'Elektrodinamika', 'Optika', 'Kvant fizikasi', 'Astronomiya']
cats = {}
for c in cat_names:
    obj, _ = Category.objects.get_or_create(name=c, defaults={'slug': c.lower().replace(' ', '-')})
    cats[c] = obj

COURSES = [
    dict(id=1,  title='Kinematika',                   cat='Mexanika',        level='beginner',     topics=8,  lessons_per=2),
    dict(id=2,  title='Dinamika',                     cat='Mexanika',        level='intermediate', topics=8,  lessons_per=2),
    dict(id=3,  title='Saqlanish qonunlari',          cat='Mexanika',        level='intermediate', topics=7,  lessons_per=2),
    dict(id=4,  title='Statika',                      cat='Mexanika',        level='beginner',     topics=6,  lessons_per=2),
    dict(id=5,  title='Suyuqlik va gazlar mexanikasi', cat='Mexanika',       level='intermediate', topics=7,  lessons_per=2),
    dict(id=6,  title='Mexanik tebranishlar',         cat='Mexanika',        level='intermediate', topics=7,  lessons_per=2),
    dict(id=7,  title='Molekulyar fizika',            cat='Termodinamika',   level='intermediate', topics=7,  lessons_per=2),
    dict(id=8,  title='Termodinamika',                cat='Termodinamika',   level='advanced',     topics=8,  lessons_per=2),
    dict(id=9,  title='Elektrostatika',               cat='Elektrodinamika', level='advanced',     topics=7,  lessons_per=2),
    dict(id=10, title="O'zgarmas tok",                cat='Elektrodinamika', level='intermediate', topics=7,  lessons_per=2),
    dict(id=11, title="Turli muhitlarda elektr toki", cat='Elektrodinamika', level='advanced',     topics=6,  lessons_per=2),
    dict(id=12, title='Magnetizm',                    cat='Elektrodinamika', level='advanced',     topics=8,  lessons_per=2),
    dict(id=13, title='Optika',                       cat='Optika',          level='intermediate', topics=9,  lessons_per=2),
    dict(id=14, title='Atom va yadro fizikasi',       cat='Kvant fizikasi',  level='advanced',     topics=7,  lessons_per=2),
    dict(id=15, title='Astronomiya',                  cat='Astronomiya',     level='intermediate', topics=7,  lessons_per=2),
]

DESCS = {
    1:  "Jismlar harakati: tezlik, tezlanish va yo'l hisoblash qonunlari.",
    2:  "Kuch va massa o'rtasidagi bog'liqlik, Nyuton qonunlari.",
    3:  "Energiya, impuls va moment saqlanish qonunlari.",
    4:  "Muvozanat sharoitlari, tayanch reaksiyalari.",
    5:  "Gidrostatika, Bernulli qonuni, suyuqlik oqimi.",
    6:  "Mayatnik, rezonans, garmonik tebranishlar.",
    7:  "Molekulalar harakati, diffuziya, ideal gaz modeli.",
    8:  "Issiqlik mashinalari, entropiya va termodinamika qonunlari.",
    9:  "Elektr zaryadlar, Kulon qonuni, elektr maydon va potentsial.",
    10: "Om va Kirxgof qonunlari, zanjir hisoblash, quvvat.",
    11: "Metallarda, gazlarda, suyuqliklarda va yarim o'tkazgichlarda tok.",
    12: "Magnit maydon, induksiya, elektromagnit tebranishlar.",
    13: "Nur tarqalishi, linzalar, interferensiya va difraksiya.",
    14: "Atom modeli, radioaktivlik, yadroviy reaksiyalar.",
    15: "Quyosh sistemasi, yulduzlar evolyutsiyasi, kosmologiya.",
}

created = 0
for c in COURSES:
    course_id = c['id']
    if Course.objects.filter(id=course_id).exists():
        print(f"  skip: {c['title']} (already exists)")
        continue

    from django.utils.text import slugify
    slug_base = slugify(c['title'])
    slug = slug_base
    counter = 1
    while Course.objects.filter(slug=slug).exists():
        slug = f"{slug_base}-{counter}"; counter += 1

    course = Course(
        title=c['title'],
        slug=slug,
        description=DESCS[course_id],
        category=cats[c['cat']],
        teacher=teacher,
        level=c['level'],
        is_published=True,
        is_free=True,
    )
    course.save()
    # Force the ID to match what frontend expects
    Course.objects.filter(pk=course.pk).update(id=course_id)
    course.pk = course_id

    # Add topics
    topic_names = [f"Mavzu {i+1}" for i in range(c['topics'])]
    for i, tname in enumerate(topic_names):
        try:
            topic = Topic.objects.create(course=course, title=tname, order=i)
            for j in range(c['lessons_per']):
                Lesson.objects.create(
                    topic=topic,
                    title=f"Dars {j+1}: {tname} — {c['title']}",
                    content=f"Bu {c['title']} kursining {tname} bo'limidagi {j+1}-dars. Matn va mashqlar kelgusida qo'shiladi.",
                    lesson_type='text',
                    order=j,
                    is_free_preview=(j == 0),
                )
        except Exception as e:
            print(f"    topic/lesson error: {e}")

    print(f"  + Created: {c['title']} (id={course_id})")
    created += 1

print(f"\nDone! {created} courses created.")
print(f"Total courses in DB: {Course.objects.count()}")
